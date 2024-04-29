// models/user.ts
import mongoose from "mongoose";
import user from "./user";
import { linkValidation } from "../utils/constants";
interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: linkValidation,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: user,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: user,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model<ICard>("card", cardSchema);
