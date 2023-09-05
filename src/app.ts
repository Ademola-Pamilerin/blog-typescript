import express from "express";
import NotFound from "./errors/notFound-error";
import ErrorMiddleware from "./middleware/error-middleware";
import userRouter from "./routes/user";
import session, { Session } from "express-session";
import cors from "cors";
import { json } from "body-parser";
import { testDbConnection } from "./db/db";
import postRouter from "./routes/post";

const app = express();

interface user {
  email: string;
  id: string;
}

app.set("trust proxy", true);

declare module "express" {
  interface Request {
    session:
      | (Session & {
          jwt?: string;
        })
      | null;
    currentUser?: user | null;
  }
}

app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    name: "blog",
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.use("*", () => {
  throw new NotFound();
});
app.use(ErrorMiddleware);

app.listen(3000, () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT SECRET IS REQUIRED");
  }

  testDbConnection()
    .then(() => {
      console.log("connection successful");
    })
    .catch((error: any) => {
      console.log(error);
      throw new Error("Error when connecting");
    });
});
