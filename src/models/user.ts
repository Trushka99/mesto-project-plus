import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { AuthError } from "../utils/errors";
import { linkValidation } from "../utils/constants";

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}
const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
    required: false,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 200,
    required: false,
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    required: false,
    validate: linkValidation,
  },

  email: {
    type: String,
    required: [true, "e-mail is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
});
userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          throw new AuthError("Неправильные почта или пароль");
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new AuthError("Неправильные почта или пароль");
          }

          return user;
        });
      });
  }
);
export default mongoose.model<IUser, UserModel>("user", userSchema);
