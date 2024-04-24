import { Router, Request, Response } from "express";
import User from "models/user";
import {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} from "../controllers/user";
const router = Router();
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

export default router;
