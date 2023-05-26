import express, { Router } from "express";
import * as Const from "../const.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { useLike } from "./post-routes.js";
import { getHomePagePosts } from "./post-routes.js";
import * as userRoutes from "./user-routes.js";
import * as channelRoutes from "./channel-routes.js";
import * as postRoutes from "./post-routes.js";
import { verifyToken, pagination, verifyVip, verifyManager } from "./utilites.js";

export const appRouter = Router();

const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    return res.status(200).json(post);
  } catch (err) {
    console.log(`get post, ${req.params.id} (${err.message})`);
  }
};



//routes
appRouter.get("/post/:id", getPost);
appRouter.patch("/post/:id", useLike);
appRouter.get("/home/post/:id", getHomePagePosts);
appRouter.get("/search/posts", postRoutes.searchPostBody);

appRouter.get("/user/:id", userRoutes.getUserInfo);
appRouter.get("/user", verifyToken, userRoutes.getUser);
appRouter.patch("/user", verifyToken, userRoutes.updateUser);
appRouter.delete("/user", verifyToken, userRoutes.deleteUser);

appRouter.get("/userVip/manager", verifyToken, verifyVip, userRoutes.getManager);
appRouter.patch("/userVip/manager", verifyToken, verifyVip, userRoutes.updateManager);
appRouter.get("/userVip/managers/", verifyToken, verifyVip, userRoutes.getAvailableManagers);
appRouter.get("/userManager/vip", verifyToken, verifyManager, userRoutes.getVipManaged);

appRouter.get("/user/channels/all", verifyToken, userRoutes.getUserChannelList);
appRouter.post("/users/register", userRoutes.register);
appRouter.post("/users/login", userRoutes.login);

appRouter.get("/channels/:name", channelRoutes.getChannelPosts, pagination);
appRouter.post("/channels/:name/posts", channelRoutes.addPostToChannel);

appRouter.get("/personal", verifyToken, (req, res) => {
  res.json(`verificato: ${JSON.stringify(req.authData)}`);
});
