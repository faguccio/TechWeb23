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
    } else {
      const userID = authData.id;
      const token = jwt.sign({ authData: authData }, Const.SECRET);
      return res.status(Const.STATUS_OK).json({ userID, token });
    }
  } catch (err) {
    // sara necessario ritornare l'errore di unauthorized nel caso di credenziali sbagliate
    console.log(`login user route,(${err.message})`);
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const changes = req.body;
    const user = await User.findByIdAndUpdate(id, changes);
    if (!user) {
      return res
        .status(Const.STATUS_NOT_FOUND)
        .json({ message: "User not found, impossible to update" });
    } else {
      return res.status(Const.STATUS_OK).json({ message: "User updated" });
    }
  } catch (err) {
    console.log(`Update user service, ${id} (${err.message})`);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(Const.STATUS_NOT_FOUND)
        .json({ message: "User not found, impossible to delete" });
    } else {
      return res.status(Const.STATUS_OK).json({ message: "User deleted" });
    }
  } catch (err) {
    console.log(`Delete user service, ${id} (${err.message})`);
  }
};

export const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ type: "manager", managing: null });
    return res.status(Const.STATUS_OK).json(managers);
  } catch (err) {
    console.log(`Get managers service, (${err.message})`);
  }
};

export const getManager = async (req, res) => {
  try {
    const vipId = req.params.id;
    const manager = await User.findOne({ type: "manager", managing: vipId });
    return res.status(Const.STATUS_OK).json(manager);
  } catch (err) {
    console.log(`Get manager service, (${err.message})`);
  }
};
export const getUserChannelList = async (req, res) => {
  try {
    const names = await userService.getUserChannels(req.authData.id);
    return res.status(Const.STATUS_OK).json(names);
  } catch (err) {
    console.log(`get channel list, (${err.message})`);
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: err.message });
  }
};
