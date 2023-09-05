import { Router } from "express";
import { body } from "express-validator";
import postController from "../controller/post";

import RequireAuth from "../middleware/require-auth";

const postRouter = Router();

postRouter.get("/all", postController.getAllPost);

postRouter.get("/all/:id", postController.getSinglePost);

postRouter.post(
  "/new",
  RequireAuth,
  [
    body("title").notEmpty().withMessage("title field must not be empty"),
    body("content").notEmpty().withMessage("content of a post cannot be empty"),
  ],
  postController.createPost
);

postRouter.put(
  "/edit/:id",
  RequireAuth,
  [
    body("title").notEmpty().withMessage("title field must not be empty"),
    body("content").notEmpty().withMessage("content of a post cannot be empty"),
  ],
  postController.editPost
);

postRouter.delete("/:id", RequireAuth,postController.deletePost);

postRouter.get("/search", postController.searchRoute);

export default postRouter;
