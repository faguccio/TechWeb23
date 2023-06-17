import express, { Router } from "express";
import * as Const from "../const.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import * as userRoutes from "./user-routes.js";
import * as channelRoutes from "./channel-routes.js";
import * as postRoutes from "./post-routes.js";
import { verifyToken, pagination, verifyTokenAndPass } from "./utilites.js";

export const appRouter = Router();

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  //console.log(user);
  return res.status(200).json(user);
};

//routes
appRouter.get("/post/:id", postRoutes.getPost);
appRouter.patch("/post/:id/likes", verifyToken, postRoutes.useLike);
//appRouter.get("/home/post/:id", getHomePagePosts);
appRouter.get("/search/posts", postRoutes.searchPostBody);
appRouter.post("/post", verifyToken, postRoutes.createPost);

appRouter.get("/user/:id", getUser);
appRouter.get("/users", userRoutes.getAllUsersFiltered);
appRouter.patch("/user/:id", userRoutes.updateUser);
appRouter.patch("/user/:id/chars", userRoutes.updateUserChars);
appRouter.delete("/user/:id", userRoutes.deleteUser);
appRouter.get("/user/manager/:id", userRoutes.getManager);

appRouter.get("/users/managers/", userRoutes.getManagers);
appRouter.get("/user/channels/all", verifyToken, userRoutes.getUserChannelList);
appRouter.post("/users/register", userRoutes.register);
appRouter.post("/users/login", userRoutes.login);

appRouter.get(
  "/channels/:name",
  verifyTokenAndPass,
  channelRoutes.getChannelPosts,
  pagination
);
appRouter.post("/channels/:name/posts", channelRoutes.addPostToChannel);
appRouter.post("/channels/create", verifyToken, channelRoutes.createChannel);
appRouter.get("/channels/:name/available", channelRoutes.isNameAvailable);

appRouter.get("/personal", verifyToken, (req, res) => {
  console.log("1 req");
  res.json(`verificato: ${JSON.stringify(req.authData)}`);
});
