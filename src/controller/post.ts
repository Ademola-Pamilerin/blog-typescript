import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ValidationErrorClass from "../errors/validation-error";
import Post from "../model/post-model";
import GeneralError from "../errors/general-error";
import sequelize from "sequelize";

const postController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, title } = req.body;
      const errors = validationResult(req);
      const classInstance = ValidationErrorClass.createClass();
      if (!errors.isEmpty()) {
        errors.array().map((val) => {
          classInstance.add_error(val);
        });
        return next(classInstance);
      }
      let newPost = new Post({ author: req.currentUser?.id, title, content });
      await newPost.save();
      res.status(200).json({ message: "successfully created a post" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, sort } = req.query;
      const posts = await Post.findAndCountAll({
        limit: 5,
        offset: typeof page === "string" ? 5 * parseInt(page) : 0,
        order: [
          ["createdAt", sort === "desc" || sort === "-1" ? "DESC" : "ASC"],
        ],
      });
      res.status(200).json({ posts: posts });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  getSinglePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const post = await Post.findOne({ where: { id: parseInt(id) } });

      if (!post) {
        return next(new GeneralError("Post not found"));
      }
      res.status(200).json({ message: post });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  editPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      const classInstance = ValidationErrorClass.createClass();
      if (!errors.isEmpty()) {
        errors.array().map((val) => {
          classInstance.add_error(val);
        });
        return next(classInstance);
      }
      const { title, content } = req.body;
      const { id } = req.params;
      let post = await Post.findOne({ where: { id: parseInt(id) } });
      if (!post) {
        return next(new GeneralError("Post not found"));
      }
      if (req.currentUser) {
        if (parseInt(req.currentUser.id) !== post.author) {
          return next(
            new GeneralError("You're are not allowed to perform this action")
          );
        }
      }
      await post.update({ title, content });
      await post.save();
      res.status(200).json({ message: "Post updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let post = await Post.findOne({ where: { id: parseInt(id) } });
      if (!post) {
        return next(new GeneralError("Post not found"));
      }
      if (req.currentUser) {
        if (parseInt(req.currentUser.id) !== post.author) {
          return next(
            new GeneralError("You're are not allowed to perform this action")
          );
        }
      }
      await post.destroy();
      res.status(200).json({ message: "Successfully delete the post" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  searchRoute: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, keyword, sort } = req.query;
      const posts = await Post.findAndCountAll({
        limit: 5,
        offset: typeof page === "string" ? 5 * parseInt(page) : 0,
        where: {
          title: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("title")),
            "LIKE",
            "%" + keyword + "%"
          ),
        },
        order: [
          ["createdAt", sort === "desc" || sort === "-1" ? "DESC" : "ASC"],
        ],
      });
      res.status(200).json({ posts });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
export default postController;
