import jwt from "jsonwebtoken";
import * as Const from "../const.js";

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
