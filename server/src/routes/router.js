import express, { Router } from "express";
import * as Const from "../const.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { useLike } from "./post-routes.js";
import { getHomePagePosts } from "./post-routes.js";
import * as userRoutes from "./user-routes.js";
import * as channelRoutes from "./channel-routes.js";
import * as postRoutes from "./post-routes.js";
import { verifyToken, pagination } from "./utilites.js";

export const appRouter = Router();

const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    return res.status(200).json(post);
  } catch (err) {
    console.log(`get post, ${req.params.id} (${err.message})`);
  }
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  //console.log(user);
  return res.status(200).json(user);
};

//routes
appRouter.get("/post/:id", getPost);
appRouter.patch("/post/:id", useLike);
appRouter.get("/home/post/:id", getHomePagePosts);
appRouter.get("/search/posts", postRoutes.searchPostBody);

appRouter.get("/user/:id", getUser);
appRouter.patch("/user/:id", userRoutes.updateUser);
appRouter.delete("/user/:id", userRoutes.deleteUser);
appRouter.get("/user/manager/:id", userRoutes.getManager);

appRouter.get("/users/managers/", userRoutes.getManagers);
appRouter.get("/user/channels/all", verifyToken, userRoutes.getUserChannelList);
appRouter.post("/users/register", userRoutes.register);
appRouter.post("/users/login", userRoutes.login);

appRouter.get("/channels/:name", channelRoutes.getChannelPosts, pagination);
appRouter.post("/channels/:name/posts", channelRoutes.addPostToChannel);

appRouter.get("/personal", verifyToken, (req, res) => {
  res.json(`verificato: ${JSON.stringify(req.authData)}`);
});
