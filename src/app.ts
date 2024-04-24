import express from "express";
// Слушаем 3000 порт
import path from "path";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import cardRouter from "./routes/cards"
import { Request, Response } from "express";

/* Создаём экземпляр MongoClient, передав URL для подключения к MongoDB */

const { PORT = 3000, BASE_PATH } = process.env;
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

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT);
