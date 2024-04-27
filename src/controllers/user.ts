import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { NotFound, BadRequest } from "../utils/errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((Users) => res.send({ data: Users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash: string) =>
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.send({ data: user }))
      .catch(() => res.status(500).send({ message: "Произошла ошибка" }))
  );
};
export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, "662cca94cfd64385dcc31ecc", {
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

  return User.findById(userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFound("Пользователь с указанным id не найден"));
      } else {
        next(err);
      }
    });
};

export const updateProfile = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new NotFound("Ошибка в вводе данных пользователя"));
      }
      return next(err);
    });
};

export const updateAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, {
    avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new NotFound("Ошибка в вводе данных пользователя"));
      }
      return next(err);
    });
};
