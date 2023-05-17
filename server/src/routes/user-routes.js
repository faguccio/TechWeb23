import * as Const from "../const.js";
import * as userService from "../services/user-service.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    return res
      .status(Const.STATUS_OK)
      .json(await userService.createUser(req.body));
  } catch (err) {
    console.log(`register user route,(${err.message})`);
  }
};

export const login = async (req, res) => {
  try {
    const authData = await userService.verifyLogin(
      req.body.name,
      req.body.password
    );
    
    if (!authData.valid_credentials) {
      return res
        .status(Const.STATUS_UNAUTHORIZED)
        .json({ message: authData.message });
    }else{
      const userID = authData.id;
      const token = jwt.sign({ authData: authData }, Const.SECRET);
      return res.status(Const.STATUS_OK).json({userID, token });
    }
  } catch (err) {
    // sara necessario ritornare l'errore di unauthorized nel caso di credenziali sbagliate
    console.log(`login user route,(${err.message})`);
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: err.message });
  }
};
