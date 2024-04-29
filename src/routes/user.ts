import { Router } from "express";
import {
  userCreationValidation,
  userAvatarValidation,
  userInfoValidation,
} from "../utils/celebrate";
import {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getProfileInfo,
} from "../controllers/user";
const router = Router();
router.post("/", userCreationValidation, createUser);
router.get("/", getUsers);
router.get("/me", getProfileInfo);
router.get("/:userId", getUserById);
router.patch("/me", userInfoValidation, updateProfile);
router.patch("/me/avatar", userAvatarValidation, updateAvatar);

export default router;
