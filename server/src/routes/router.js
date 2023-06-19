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
appRouter.get("/api/post/:id", postRoutes.getPost);
appRouter.patch("/api/post/:id/likes", verifyToken, postRoutes.useLike);
appRouter.post("/api/post/:id/comments", verifyToken, postRoutes.createComment);
//appRouter.get("/home/post/:id", getHomePagePosts);
appRouter.get("/api/search/posts", postRoutes.searchPostBody);
appRouter.post("/api/post", verifyToken, postRoutes.createPost);

appRouter.get("/api/user/:id", getUser);
appRouter.get("/api/users", userRoutes.getAllUsersFiltered);
appRouter.patch("/api/user/:id", userRoutes.updateUser);
appRouter.patch("/api/user/:id/chars", userRoutes.updateUserChars);
appRouter.delete("/api/user/:id", userRoutes.deleteUser);
appRouter.get("/api/user/manager/:id", userRoutes.getManager);

appRouter.get("/api/users/managers/", userRoutes.getManagers);
appRouter.get(
  "/api/user/channels/all",
  verifyToken,
  userRoutes.getUserChannelList
);
appRouter.post("/api/users/register", userRoutes.register);
appRouter.post("/api/users/login", userRoutes.login);

appRouter.get(
  "/api/channels/:name",
  verifyTokenAndPass,
  channelRoutes.getChannelPosts,
  pagination
);
appRouter.post("/api/channels/:name/posts", channelRoutes.addPostToChannel);
appRouter.post(
  "/api/channels/create",
  verifyToken,
  channelRoutes.createChannel
);
appRouter.get("/api/channels/:name/available", channelRoutes.isNameAvailable);

appRouter.get("/api/personal", verifyToken, (req, res) => {
  console.log("1 req");
  res.json(`verificato: ${JSON.stringify(req.authData)}`);
});
