export const BAD_REQUEST: number = 400;
export const NOT_FOUND: number = 404;
export const INTERNAL_SERVER_ERROR: number = 500;
export const AUTHORIZATION_ERROR: number = 401;
export const EMAIL_ALREADY_REGISTERED: number = 409;
export const OWNER_RIGHTS: number = 403
import { urlPattern } from "./celebrate";
export const linkValidation: any = {
  validator: (link: string) => urlPattern.test(link),
  message: "Некорректная ссылка на аватар",
};
