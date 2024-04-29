import { Request, Response, NextFunction } from "express";
import user from "../models/user";
import { NotFound, BadRequest, EmailRegisteredError } from "../utils/errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return user
    .find({})
    .then((Users) => res.send({ data: Users }))
    .catch((err) => next(err));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash: string) =>
    user
      .create({ name, about, avatar, email, password: hash })
      .then((User) => res.send({ data: User }))
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new EmailRegisteredError(
              "Аккаунт с указанной почтой уже существует"
            )
          );
        }
        if (err.name === "ValidationError") {
          return next(new BadRequest("Ошибка в вводе данных пользователя"));
        }
        return next(err);
      })
  );
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return user
    .findUserByCredentials(email, password)
    .then((User) => {
      res.send({
        token: jwt.sign({ _id: User._id }, "662ce4ad3098cc1b2a1172c0", {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  return user
    .findById(userId)
    .orFail()

    .then((User) => {
      res.send({ data: User });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Пользователь с указанным id не найдена"));
      } else if (err.name === "CastError") {
        next(new NotFound("Неправильный формат идентификатора"));
      } else {
        next(err);
      }
    });
};

export const updateProfile = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return user
    .findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    )
    .then((User) => {
      res.send({ data: User });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequest("Ошибка в вводе данных пользователя"));
      }
      return next(err);
    });
};

export const updateAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return user
    .findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      { new: true, runValidators: true }
    )
    .then((User) => res.send({ data: User }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequest("Ошибка в вводе данных пользователя"));
      }
      return next(err);
    });
};

export const getProfileInfo = (req: any, res: Response, next: NextFunction) => {
  return user
    .findById(req.user._id)
    .then((User) => {
      res.send({ name: User?.name, about: User?.about });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new NotFound("Пользователь с указанным id не найден"));
      }
      return next(err);
    });
};
