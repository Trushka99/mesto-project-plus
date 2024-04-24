import { Request, Response } from "express";
import User from "../models/user";

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((Users) => res.send({ data: Users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

export const updateProfile = (req: any, res: Response) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

export const updateAvatar = (req: any, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, {
    avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
