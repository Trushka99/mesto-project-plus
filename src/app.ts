// Слушаем 3000 порт
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { errors } from "celebrate";
import router from "./routes/index";
import { INTERNAL_SERVER_ERROR } from "./utils/constants";
/* Создаём экземпляр MongoClient, передав URL для подключения к MongoDB */

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://0.0.0.0:27017/mestodb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: any, res: any, next) => {
  req.user = {
    _id: "66255e8defd06a30515dfeb2", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/", router);

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
