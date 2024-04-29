import {
  NOT_FOUND,
  BAD_REQUEST,
  AUTHORIZATION_ERROR,
  EMAIL_ALREADY_REGISTERED,
  OWNER_RIGHTS,
} from "./constants";

export class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

export class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZATION_ERROR;
  }
}

export class EmailRegisteredError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EMAIL_ALREADY_REGISTERED;
  }
}

export class OwnerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = OWNER_RIGHTS;
  }
}
