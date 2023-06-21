import express, { Router } from "express";
import * as Const from "../const.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import * as userRoutes from "./user-routes.js";
import * as channelRoutes from "./channel-routes.js";
import * as postRoutes from "./post-routes.js";
import {
  verifyToken,
  pagination,
  verifyVip,
  verifyManager,
  verifyTokenAndPass,
} from "./utilites.js";

export const appRouter = Router();

//routes
appRouter.get("/api/post/:id", postRoutes.getPost);
appRouter.patch("/api/post/:id/likes", verifyToken, postRoutes.useLike);
appRouter.post("/api/post/:id/comments", verifyToken, postRoutes.createComment);
appRouter.post(
  "/api/post/:id/comments/manager",
  verifyToken,
  postRoutes.createCommentManager
);
appRouter.get("/api/search/posts", postRoutes.searchPostBody);
appRouter.post("/api/post", verifyToken, postRoutes.createPost);
appRouter.patch("/api/post/update/:id", postRoutes.updatePostById);
appRouter.get("/api/posts", postRoutes.getAllPostFiltered);
appRouter.get("/api/posts/:userId", postRoutes.getAllPostByUserId);
appRouter.get(
  "/api/posts/managed/all",
  verifyToken,
  postRoutes.getAllPostOfManaged
);

appRouter.get("/api/users", userRoutes.getAllUsersFiltered);
appRouter.patch("/api/user/:id/chars", userRoutes.updateUserChars);
appRouter.get("/api/user/:id/stats", userRoutes.getUserStats);
appRouter.get(
  "/api/user/channels/all",
  verifyToken,
  userRoutes.getUserChannelList
);

appRouter.get("/api/user/:id", userRoutes.getUserById);
appRouter.delete("/api/user/:id", userRoutes.deleteUserById);
appRouter.get("/api/user/info/:id", userRoutes.getUserInfoById);
appRouter.get("/api/user", verifyToken, userRoutes.getUser);
appRouter.patch("/api/user", verifyToken, userRoutes.updateUser);
appRouter.delete("/api/user", verifyToken, userRoutes.deleteUser);

appRouter.get(
  "/api/userVip/manager",
  verifyToken,
  verifyVip,
  userRoutes.getManager
);
appRouter.patch(
  "/api/userVip/manager",
  verifyToken,
  verifyVip,
  userRoutes.updateManager
);
appRouter.get(
  "/api/userVip/managers/",
  verifyToken,
  verifyVip,
  userRoutes.getAvailableManagers
);
appRouter.get(
  "/api/userManager/vip",
  verifyToken,
  verifyManager,
  userRoutes.getVipManaged
);
appRouter.patch(
  "/api/userManager/vip",
  verifyToken,
  verifyManager,
  userRoutes.updateVipManaged
);

appRouter.post("/api/users/register", userRoutes.register);
appRouter.post("/api/users/login", userRoutes.login);
appRouter.post("/api/users/loginPro", userRoutes.loginPro);
appRouter.post("/api/users/loginAdmin", userRoutes.loginAdmin);

appRouter.get("/api/channels/all", channelRoutes.getAllChannels);
appRouter.get(
  "/api/channels/:name",
  verifyTokenAndPass,
  channelRoutes.getChannelPosts,
  pagination
);
appRouter.post("/api/channels/:name/posts", channelRoutes.addPostToChannel);
appRouter.patch(
  "/api/channels/:name/posts",
  channelRoutes.addPostToChannel_Admin
);
appRouter.post(
  "/api/channels/create",
  verifyToken,
  channelRoutes.createChannel
);
appRouter.get("/api/channels/:name/available", channelRoutes.isNameAvailable);
appRouter.patch(
  "/api/channels/:name/post",
  channelRoutes.removePostFromChannel
);
appRouter.get("/api/channel/:id/posts", channelRoutes.getChannelPostsById);
appRouter.patch("/api/channel/:id", channelRoutes.updateChannelById);
appRouter.delete("/api/channel/:id", channelRoutes.deleteChannelById);

appRouter.get("/api/personal", verifyToken, (req, res) => {
  console.log("1 req");
  res.json(`verificato: ${JSON.stringify(req.authData)}`);
});
