import { Router } from "express";
import {
  userAvatarValidation,
  userInfoValidation,
  getUserIdValidation,
} from "../utils/celebrate";
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getProfileInfo,
} from "../controllers/user";

const router = Router();
router.get("/", getUsers);
router.get("/me", getProfileInfo);
router.get("/:userId", getUserIdValidation, getUserById);
router.patch("/me", userInfoValidation, updateProfile);
router.patch("/me/avatar", userAvatarValidation, updateAvatar);

export default router;
