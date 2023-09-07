import { NextFunction, Request, Response } from "express";
import BaseError from "../../errors/base-error";

const ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({ message: error.resolver() });
  } else {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
export default ErrorMiddleware;
