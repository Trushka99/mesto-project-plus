import { Request, Response, NextFunction } from "express";
import user from "../models/user";
import { NotFound, BadRequest } from "../utils/errors";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return user
    .find({})
    .then((Users) => res.send({ data: Users }))
    .catch((err) => next(err));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return user
    .create({ name, about, avatar })
    .then((User) => res.send({ data: User }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequest("Ошибка в вводе данных пользователя"));
      }
      return next(err);
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
      }
      if (err.name === "CastError") {
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
