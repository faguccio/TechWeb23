import { Channel } from "../models/Channel.js";

export const getChannelPosts = async (id) => {
  try {
    const channel = await Channel.findOne({ _id: id });
    return channel.posts;
  } catch (err) {
    console.log(`Update likes service, ${id} (${err.message})`);
  }
};
