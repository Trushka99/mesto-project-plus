import { Router, Request, Response } from "express";
import { createCard, getCards, deleteCard } from "../controllers/cards";
const router = Router();
router.post("/", createCard);
router.get("/", getCards);
router.delete("/:cardId", deleteCard);

export default router;
