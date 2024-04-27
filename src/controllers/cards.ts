import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { NotFound, BadRequest } from "../utils/errors";

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Введенны некорректные данные"));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFound("Карточка с указанным id не найдена"));
      } else {
        next(err);
      }
    });
};
export const likeCard = (req: any, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFound("Карточка с указанным id не найдена"));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFound("Карточка с указанным id не найдена"));
      } else {
        next(err);
      }
    });
};
