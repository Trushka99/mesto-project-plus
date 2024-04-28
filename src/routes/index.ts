import { Router, NextFunction, Request, Response } from "express";
import userRouter from "./user";
import cardRouter from "./cards";
import { NotFound } from "../utils/errors";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFound("Страница не найдена"));
});

export default router;
