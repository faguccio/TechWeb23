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
