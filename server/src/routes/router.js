import express, { Router } from "express";
import * as Const from "../const.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { useLike } from "../routes/post-route.js";
import { getHomePagePosts } from "./post-route.js";
import * as userRoutes from "./user-routes.js";
import { verifyToken } from "./utilites.js";

export const appRouter = Router();

const getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  return res.status(200).json(post);
  //return res.status(OK_CONST).json(animal);
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  //console.log(user);
  return res.status(200).json(user);
};

//routes
appRouter.get("/post/:id", getPost);
appRouter.get("/user/:id", getUser);
appRouter.patch("/post/:id", useLike);
appRouter.get("/home/post/:id", getHomePagePosts);

appRouter.post("/users/register", userRoutes.register);
appRouter.post("/users/login", userRoutes.login);

appRouter.get("/personal", verifyToken, (req, res) => {
  res.json(`verificato: ${JSON.stringify(req.authData)}`);
});
