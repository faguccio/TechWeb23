import jwt from "jsonwebtoken";
import * as Const from "../const.js";
import { User } from "../models/User.js";


export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    jwt.verify(authHeader, Const.SECRET, (err, authData) => {
      if (err) {
        return res
          .status(Const.STATUS_UNAUTHORIZED)
          .json(`error validating token: ${err}`);
      } else {
        req.authData = authData.authData;
        return next();
      }
    });
  } else {
    return res
      .status(Const.STATUS_UNAUTHORIZED)
      .json("Authentication header not found");
  }
};

export const pagination = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    let allPages = res.locals.content;
    const pageContent = allPages.slice(startIndex, endIndex);
    const ret = pageContent;
    return res.status(Const.STATUS_OK).json(ret);
  } catch (err) {
    console.log(`pagination middleware, (${err.message})`);
    return res.status(Const.BAD_REQUEST).json({ error: "bad paginaiton" });
  }
};

export const verifyVip = async (req, res, next) => {
  const user = await User.findOne({ _id: req.authData.id});
  if (user.type === "vip") {
    return next();
  }else{
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: "Operation only for Vip user" });
  }
};

export const verifyManager = async (req, res, next) => {
  const user = await User.findOne({ _id: req.authData.id});
  if (user.type === "manager") {
    return next();
  }else{
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: "Operation only for Manager user" });
  }
}