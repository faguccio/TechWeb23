import express, { Router } from "express";
import * as Const from "../const.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const appRouter = Router();

const getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  return res.status(200).json(post);
  //return res.status(OK_CONST).json(animal);
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  console.log(user);
  return res.status(200).json(user);
};

//messages
appRouter.get("/message/:id", getPost);
appRouter.get("/user/:id", getUser);
