import { Channel } from "../models/Channel.js";

export const getChannelPosts = async (id) => {
  try {
    const channel = await Channel.findOne({ _id: id });
    return channel.posts
      .sort((objA, objB) => Number(objB.timestamp) - Number(objA.timestamp))
      .map((post) => post.content);
  } catch (err) {
    console.log(`get channel service, ${id} (${err.message})`);
  }
};
