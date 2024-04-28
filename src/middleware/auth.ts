import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthError } from "../utils/errors";

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = (next: NextFunction) => {
  return next(new AuthError("Необходима Авторизация"))};

const extractBearerToken = (header: string) => {
  return header.replace("Bearer ", "");
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "662ce4ad3098cc1b2a1172c0");
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload as { _id: JwtPayload }; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
