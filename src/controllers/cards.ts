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
export const likeCard = async (req: any, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  try {
    const Card = await card.findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!Card) {
      return next(new NotFound("Карточки с таким айди не обнаружена"));
    }
    return res.json({ data: Card });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new NotFound("Неправильный формат идентификатора"));
    }
    return next(error);
  }
};

export const dislikeCard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  try {
    const Card = await card.findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!Card) {
      return next(new NotFound("Карточки с таким айди не обнаружена"));
    }
    return res.json({ data: Card });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new NotFound("Неправильный формат идентификатора"));
    }
    return next(error);
  }
};
