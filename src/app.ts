import express from "express";
// Слушаем 3000 порт
import path from "path";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import cardRouter from "./routes/cards";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { errors } from "celebrate";
import { INTERNAL_SERVER_ERROR } from "./utils/constants";
import { loginUser, createUser } from "./controllers/user";
import auth from "./middleware/auth";
import { requestLogger, errorLogger } from "./middleware/logger";
import { userCreationValidation, loginValidation } from "./utils/celebrate";
/* Создаём экземпляр MongoClient, передав URL для подключения к MongoDB */

const { PORT = 3000, BASE_PATH } = process.env;
mongoose.connect("mongodb://0.0.0.0:27017/mestodb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use("/signin", loginValidation, loginUser);
app.use("/signup", userCreationValidation, createUser);
app.use(auth);

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(express.static(path.join(__dirname, "public")));
app.use(errorLogger);
app.use(errors());
app.use((err: any, req: Request, res: Response) => {
  console.log(err);
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const message =
    statusCode === INTERNAL_SERVER_ERROR
      ? "На сервере произошла ошибка"
      : err.message;
  res.status(statusCode).send({ message });
});
app.listen(PORT);
