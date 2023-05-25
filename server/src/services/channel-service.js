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

export const getChannelPostByName = async (name) => {
  try {
    const channel = await Channel.findOne({ name: name });
    return channel.posts
      .sort((objA, objB) => Number(objB.timestamp) - Number(objA.timestamp))
      .map((post) => post.content);
  } catch (err) {
    console.log(`get channel by name service, ${name} (${err.message})`);
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

export const channelIdToName = async (id) => {
  try {
    const channel = await Channel.findOne({ _id: id });
    return channel.name;
  } catch (err) {
    console.log(`get channel name from id service, ${id} (${err.message})`);
  }
};

export const addPostToChannelByName = async (
  channelName,
  post_ID,
  timestamp
) => {
  try {
    const id = await channelNameToId(channelName);
    const res = await addPostToChannel(id, post_ID, timestamp);
    return res;
  } catch (err) {
    console.log(
      `add post to channel by name service, ${channelName} (${err.message})`
    );
  }
};
