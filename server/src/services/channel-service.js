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

export const addPostToChannel = async (channel_ID, post_ID, timestamp) => {
  try {
    const channel = await Channel.findOne({ _id: channel_ID });
    channel.posts.push({ content: post_ID, timestamp: timestamp });
    return await channel.save();
  } catch (err) {
    console.log(`get channel service, ${id} (${err.message})`);
  }
};

export const channelNameToId = async (channelName) => {
  try {
    console.log(channelName);
    const channel = await Channel.findOne({ name: channelName });
    return channel._id;
  } catch (err) {
    console.log(
      `get channel id from name service, ${channelName} (${err.message})`
    );
  }
};
