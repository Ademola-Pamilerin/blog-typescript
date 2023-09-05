import { NextFunction, Request, Response } from "express";
import RequestError from "../errors/request-error";
import { validationResult } from "express-validator";
import ValidationErrorClass from "../errors/validation-error";
import Password from "../shared/password-hash";
import { jwtProvider } from "../shared/token";
import User from "../model/user-model";
import GeneralError from "../errors/general-error";

const UserController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const classInstance = ValidationErrorClass.createClass();
        errors.array().map((val) => {
          classInstance.add_error(val);
        });
        return next(classInstance);
      }
      const { email, password } = req.body;

      const hashedPassword = await Password.toHash(password.trim());
      let user;
      user = await User.findOne({
        where: {
          email,
        },
      });
      if (user) {
        return next(new GeneralError("Account already exist for this user"));
      }
      user = new User({ email, password: hashedPassword });
      await user.save();
      const token = jwtProvider({ email, id: user.dataValues.id });
      if (req.session) {
        req.session.jwt = token;
      }
      res.status(200).json({ message: "User created successfully", token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const classInstance = ValidationErrorClass.createClass();
        errors.array().map((val) => {
          classInstance.add_error(val);
        });
        return next(classInstance);
      }
      const { email, password } = req.body;
      let user;
      user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return next(new GeneralError("invalid email or password"));
      }
      const { password: hashedPassword } = user.dataValues;
      const isMatch = await Password.compare(hashedPassword, password);
      if (!isMatch) {
        return next(new GeneralError("invalid email or password"));
      }

      const token = jwtProvider({ email, id: user.dataValues.id });
      if (req.session) {
        req.session.jwt = token;
      }

      res
        .status(200)
        .json({ message: "User AUthenticated successfully", token: token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  currentUser: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ currentUser: req.currentUser });
    } catch (error: any) {
      const errorVal = new RequestError(error.message);
      throw errorVal;
    }
  },
};

export default UserController;
