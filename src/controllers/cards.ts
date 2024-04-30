import { Request, Response, NextFunction } from "express";
import card from "../models/card";
import { NotFound, BadRequest, OwnerError } from "../utils/errors";
import mongoose from "mongoose";

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
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest("Введенны некорректные данные"));
      } else {
        next(err);
      }
    });
};

export const deleteCard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  try {
    const cardToDelete = await card.findById(cardId).orFail();

    if (cardToDelete.owner.toString() === req.user?._id) {
      return cardToDelete
        .deleteOne()
        .then((Card: any) => res.send({ data: Card }))
        .catch((err: any) => {
          next(err);
        });
    }
    next(new OwnerError("Вы не можете удалять чужие карточки"));
  } catch (err) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFound("Карточка с указанным id не найдена"));
    } else if (err instanceof mongoose.Error.CastError) {
      next(new NotFound("Неправильный формат идентификатора"));
    } else {
      next(err);
    }
  }
};
export const likeCard = (req: any, res: Response, next: NextFunction) => {
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .orFail()
    .then((Card) => res.send({ data: Card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound("Карточка с указанным id не найдена"));
      } else if (err instanceof mongoose.Error.CastError) {
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
      { new: true }
    )
    .orFail()
    .then((Card) => res.send({ data: Card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound("Карточка с указанным id не найдена"));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new NotFound("Неправильный формат идентификатора"));
      } else {
        next(err);
      }
    });
};
