import * as Const from "../const.js";
import * as channelService from "../services/channel-service.js";

export const getChannelPosts = async (req, res) => {
  try {
    const id = req.params.id;
    const ret = await channelService.getChannelPosts(id);
    return res.status(Const.STATUS_OK).json(ret);
  } catch (err) {
    console.log(`get channel's posts route, ${id} (${err.message})`);
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
