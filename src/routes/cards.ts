import { Router } from "express";
import { cardValidation, getCardValidation } from "../utils/celebrate";
import {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

const router = Router();
router.post("/", cardValidation, createCard);
router.get("/", getCards);
router.delete("/:cardId", getCardValidation, deleteCard);
router.put("/:cardId/likes", getCardValidation, likeCard);
router.delete("/:cardId/likes", getCardValidation, dislikeCard);

export default router;
