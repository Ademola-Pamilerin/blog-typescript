import { NextFunction, Request, Response } from "express";
import GeneralError from "../../errors/general-error";
import { jwtVerifier } from "../../shared/token";
import User from "../../model/user-model";

const RequireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next(new GeneralError("please login to continue", 400));
  }
  const token = req.session.jwt;
  const payload = (await jwtVerifier(token)) as any;
  const user = await User.findOne({
    where: {
      email: payload.email,
    },
  });
  req.currentUser = { email: user?.dataValues.email, id: user?.dataValues.id };
  next();
};
export default RequireAuth;
