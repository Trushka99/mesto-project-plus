import { Router} from "express";
import { cardValidation } from "../utils/celebrate";
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
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

export default router;
