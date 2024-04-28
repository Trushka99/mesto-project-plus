import { Request, Response, NextFunction } from "express";
import card from "../models/card";
import { NotFound, BadRequest } from "../utils/errors";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return card
    .create({ name, link, owner: req.user._id })
    .then((Card) => res.status(201).send({ data: Card }))
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
  return card
    .findByIdAndDelete(cardId)
    .orFail()
    .then((Card) => res.send({ data: Card }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Карточка с указанным id не найдена"));
      }
      if (err.name === "CastError") {
        next(new NotFound("Неправильный формат идентификатора"));
      } else {
        next(err);
      }
    });
};
export const likeCard = (req: any, res: Response, next: NextFunction) => {
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail()
    .then((Card) => res.send({ data: Card }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Карточка с указанным id не найдена"));
      }
      if (err.name === "CastError") {
        next(new NotFound("Неправильный формат идентификатора"));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail()
    .then((Card) => res.send({ data: Card }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFound("Карточка с указанным id не найдена"));
      }
      if (err.name === "CastError") {
        next(new NotFound("Неправильный формат идентификатора"));
      } else {
        next(err);
      }
    });
};
