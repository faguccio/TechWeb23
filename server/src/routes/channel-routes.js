import * as Const from "../const.js";
import * as channelService from "../services/channel-service.js";
import * as userService from "../services/user-service.js";
import * as postService from "../services/post-service.js";
import { Channel } from "../models/Channel.js";

export const getChannelPosts = async (req, res, next) => {
  try {
    let name = req.params.name;
    name = ["§", "@"].includes(name[0]) ? name : "#" + name;
    if (name[0] == "@") {
      if (name == "@me") {
        console.log(req.authData);

        if (!!req.authData) {
          const ret = await userService.getUserHome(req.authData.id);
          res.locals.content = ret;
          next();
        } else {
          console.log("prendi i post normali");
          //ritorna solo canali squeal ufficiali
        }
      }
      //ritorna i post inviati dall'utente, dovranno essere leggibili dal pubblico
    }
    const ret = await channelService.getChannelPostByName(name);
    res.locals.content = ret;
    next();
  } catch (err) {
    console.log(`get channel's posts route by name  (${err.message})`);
  }
};

export const addPostToChannel = async (req, res) => {
  try {
    let name = req.params.name;
    name = ["§", "@"].includes(name[0]) ? name : "#" + name;
    console.log(req.body);
    const post_ID = req.body.post_ID;
    const timestamp = req.body.timestamp;

    const channel_ID = await channelService.channelNameToId(name);
    //TODO verifica che l'utente possa postare in tal canale

    return res
      .status(Const.STATUS_OK)
      .json(
        await channelService.addPostToChannel(channel_ID, post_ID, timestamp)
      );
  } catch (err) {
    console.log(`add post to channel routes, (${err.message})`);
  }
};
//§

export const isNameAvailable = async (req, res) => {
  try {
    const name = "#" + req.params.name;
    const chList = await channelService.getChannelByName(name);
    console.log(chList);
    const isAvailable = !chList;
    return res.status(Const.STATUS_OK).json(isAvailable);
  } catch (err) {
    console.log(`isNameAvailable, channel routes, (${err.message})`);
  }
};

export const createChannel = async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    if (!(await channelService.isNameAvailable(name)))
      return res
        .status(Const.STATUS_CONFLICT)
        .json({ status: "error", msg: "Channel already exists" });
    const newChannel = { name: name, description: description };
    if (name[0] == "§" || name[0] == "#") {
      //owenrs sara' solo chi crea, estendibile in seguito
      const userId = req.authData.id;
      if (!!req.body.owners) newChannel.owners = [userId];
      //aggiungo solo gli utenti che trovo
      if (!!req.body.allowed_readers) {
        newChannel.allowed_readers = await Promise.all(
          req.body.allowed_readers.map(async (name) => {
            const userId = await userService.userNameToId(name);
            if (!!userId) return userId;
          })
        );
      }
      if (!!req.body.allowed_writers) {
        newChannel.allowed_writers = await Promise.all(
          req.body.allowed_writers.map(async (name) => {
            const userId = await userService.userNameToId(name);
            if (!!userId) return userId;
          })
        );
      }
    }
    const myStatus = await channelService.createChannel(newChannel);
    //console.log(myStatus);createChannel
    return res.status(Const.STATUS_OK).json(myStatus);
  } catch (err) {
    console.log(`createChannel, channel routes, (${err.message})`);
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    return res.status(Const.STATUS_OK).json(channels);
  } catch (err) {
    console.log(`getAllChannels, channel routes, (${err.message})`);
  }
};

export const getChannelPostsById = async (req, res) => {
  try {
    const channel_ID = req.params.id;
    const channel = await Channel.findById(channel_ID).populate({
      path: 'posts.content',
      model: 'Post'
    });
    return res.status(Const.STATUS_OK).json(channel.posts);
  } catch (err) {
    console.log(`getChannelPostsById, channel routes, (${err.message})`);
  }
}

export const updateChannelById = async (req, res) => {
  try {
    const channel_ID = req.params.id;
    const newChannel = req.body;
    const updatedChannel = await Channel.findByIdAndUpdate(channel_ID, newChannel);
    if (!updatedChannel) return res.status(Const.STATUS_NOT_FOUND).json({ status: "error", msg: "Channel to update not found" });
    return res.status(Const.STATUS_OK).json({ status: "success", message: "Channel updated successfully" });
  } catch (err) {
    console.log(`updateChannelById, channel routes, (${err.message})`);
  }
}

export const deleteChannelById = async (req, res) => {
  try {
    const channel_ID = req.params.id;
    const deletedChannel = await Channel.findByIdAndDelete(channel_ID);
    if (!deletedChannel) return res.status(Const.STATUS_NOT_FOUND).json({ status: "error", msg: "Channel to delete not found" });
    return res.status(Const.STATUS_OK).json({ status: "success", message: "Channel deleted successfully" });
  } catch (err) {
    console.log(`deleteChannelById, channel routes, (${err.message})`);
  }
}

export const removePostFromChannel = async (req, res) => {
  try {
    const channelName = req.params.name;
    //console.log('channel name:',channelName);
    const post_ID = req.body.post_ID;

    const channel_ID = await channelService.channelNameToId(channelName);
    const updatedChannel = await channelService.removePostFromChannel(channel_ID, post_ID);

    if (!updatedChannel) return res.status(Const.STATUS_NOT_FOUND).json({ status: "error", msg: "Channel to update not found" });

    const response = await postService.removeRecipient(post_ID, channelName)
    if (response.status != "success") return res.status(Const.STATUS_NOT_FOUND).json({ status: "error", msg: "Post to update not found" });

    return res.status(Const.STATUS_OK).json({ status: "success", message: "Post from Channel removed successfully" });
  } catch (err) {
    console.log(`removePostFromChannel, channel routes, (${err.message})`);
  }
}