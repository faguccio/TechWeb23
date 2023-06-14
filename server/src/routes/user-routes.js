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

export const loginPro = async (req, res) => {
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
      //console.log("authData: ",authData);
      if(!authData.isPro)
        return res.status(Const.STATUS_UNAUTHORIZED).json({ message: "User is not Pro" });
      else{
        const userID = authData.id;
        const token = jwt.sign({ authData: authData }, Const.SECRET);
        return res.status(Const.STATUS_OK).json({ userID, token });
      }
    }

  }
  catch (err) {
    console.log(`login pro user route,(${err.message})`);
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: err.message });
  }
};


export const getUserInfo = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id});
  return res.status(200).json({
    name: user.name,
    propic_path: user.propic_path,
  });
};

export const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.authData.id});
  return res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  try {
    const id = req.authData.id;
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
    const id = req.authData.id;
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

export const getAvailableManagers = async (req, res) => {
  try {
    const managers = await User.find({ type: "manager", managing: null });
    return res.status(Const.STATUS_OK).json(managers);
  } catch (err) {
    console.log(`Get available managers service, (${err.message})`);
  }
};

export const getManager = async (req, res) => {
  try {
    const vipId = req.authData.id;
    const manager = await User.findOne({ type: "manager", managing: vipId });
    if(manager){
      return res.status(Const.STATUS_OK).json(
        {
          _id: manager._id,
          name: manager.name
        }
      );
    }else
      return res.status(Const.STATUS_OK).json(null);
  } catch (err) {
    console.log(`Get manager service, (${err.message})`);
  }
};

export const updateManager = async (req, res) => {
  try {
    const managerId = req.body.managerId;
    const manager = await User.findByIdAndUpdate(managerId, {managing: req.body.managing});
    if(manager){
      return res.status(Const.STATUS_OK).json({message: "Manager updated"});
    }else
      return res.status(Const.STATUS_NOT_FOUND).json({message: "Manager not found, impossible to update"});
  } catch (err) {
    console.log(`Update manager service, (${err.message})`);
  }
};

export const getVipManaged = async (req, res) => {
  try {
    const managerId = req.authData.id;
    const manager = await User.findById(managerId);
    if(manager){
      const vip = await User.findById(manager.managing);
      if(vip){
        return res.status(Const.STATUS_OK).json(
          {
            _id: vip._id,
            name: vip.name,
            propic_path: vip.propic_path,
          }
        );
      }else
        return res.status(Const.STATUS_OK).json(null);
    }else
      return res.status(Const.STATUS_NOT_FOUND).json({message: "Manager not found"});
  } catch (err) {
    console.log(`Get vip managed service, (${err.message})`);
  }
};

export const updateVipManaged = async (req, res) => {
  try {
    const managerId = req.authData.id;
    const manager = await User.findById(managerId);
    if(manager){
      const changes = req.body;
      const vip = await User.findByIdAndUpdate(manager.managing, changes);
      if(vip){
        return res.status(Const.STATUS_OK).json({message: "Vip updated"});
      }else
        return res.status(Const.STATUS_NOT_FOUND).json({message: "Vip not found, impossible to update"});
    }else
      return res.status(Const.STATUS_NOT_FOUND).json({message: "Manager not found"});
  } catch (err) {
    console.log(`Update vip managed service, (${err.message})`);
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
