import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controller/user";
import RequireAuth from "../controller/middleware/require-auth";

const userRouter = Router();

userRouter.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .withMessage("email field is empty")
      .isEmail()
      .withMessage("email must be a valid email address"),
    body("password")
      .notEmpty()
      .withMessage("password field must not be empty")
      .custom((value, { req }) => {
        if (value.trim().length < 5 || value.trim().length > 20) {
          return false;
        } else {
          return true;
        }
      })
      .withMessage(
        "Password length must be greater than 5 letter and less than 20 letters"
      ),
  ],
  UserController.createUser
);
userRouter.put(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email field is empty")
      .isEmail()
      .withMessage("email must be a valid email address"),
    body("password").notEmpty().withMessage("password field must not be empty"),
  ],
  UserController.loginUser
);

userRouter.get("/user", RequireAuth, UserController.currentUser);
userRouter.get("/logout", RequireAuth, UserController.logoutUser);

export default userRouter;
