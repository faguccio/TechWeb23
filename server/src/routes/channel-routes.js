import * as Const from "../const.js";
import * as channelService from "../services/channel-service.js";

export const getChannelPosts = async (req, res, next) => {
  try {
    let name = req.params.name;
    name = ["§", "@"].includes(name[0]) ? name : "#" + name;
    if (name[0] == "@") {
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
    if (!(await channelService.isNameAvailable(name)))
      return res
        .status(Const.STATUS_CONFLICT)
        .json({ status: "error", msg: "Channel already exists" });
    const newChannel = { name: name };
    if (name[0] == "§") {
      if (!!req.body.owners) newChannel.owners = req.body.owners;
      if (!!req.body.allowed_readers)
        newChannel.allowed_readers = req.body.allowed_readers;
      if (!!req.body.allowed_writers)
        newChannel.allowed_writers = req.body.allowed_writers;
    }
    const myStatus = await channelService.createChannel(newChannel);
    //console.log(myStatus);createChannel
    return res.status(Const.STATUS_OK).json(myStatus);
  } catch (err) {
    console.log(`createChannel, channel routes, (${err.message})`);
  }
};
