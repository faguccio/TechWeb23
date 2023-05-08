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
  //console.log(user);
  return res.status(200).json(user);
};

const useLike = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    console.log(body);

    const post = await Post.findOne({ _id: req.params.id });
    //console.log(post);
    const sign = body.increase ? 1 : -1;
    if (body.type === "negative") post.reactions.negative += sign;
    if (body.type === "positive") post.reactions.positive += sign;
    post.save();

    return res.status(Const.STATUS_OK).json();
  } catch (err) {
    console.log(err);
  }
};

//messages
appRouter.get("/post/:id", getPost);
appRouter.get("/user/:id", getUser);
appRouter.patch("/post/:id", useLike);
