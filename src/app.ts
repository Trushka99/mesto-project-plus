// Слушаем 3000 порт
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { errors } from "celebrate";
import router from "./routes/index";
import { INTERNAL_SERVER_ERROR } from "./utils/constants";
import auth from "./middleware/auth";
import { loginUser, createUser } from "./controllers/user";
import { requestLogger, errorLogger } from "./middleware/logger";
import { userCreationValidation, loginValidation } from "./utils/celebrate";

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://0.0.0.0:27017/mestodb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use("/signin", loginValidation, loginUser);
app.use("/signup", userCreationValidation, createUser);
app.use(auth);

app.use("/", router);
app.use(errorLogger);
app.use(errors());
app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const message =
    statusCode === INTERNAL_SERVER_ERROR
      ? "На сервере произошла ошибка"
      : err.message;

  res.status(statusCode).send({ message });
});
app.listen(PORT);
