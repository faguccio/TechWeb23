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

export const getChannelPostsUn = async (id) => {
  try {
    const channel = await Channel.findOne({ _id: id });
    return channel.posts;
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
    console.log(`getChannelPostByName, service, ${name} (${err.message})`);
  }
};

export const addPostToChannel = async (channel_ID, post_ID, timestamp) => {
  try {
    const channel = await Channel.findOne({ _id: channel_ID });
    channel.posts.push({ content: post_ID, timestamp: timestamp });
    return await channel.save();
  } catch (err) {
    console.log(`addPostToChannel, ${id} (${err.message})`);
  }
};

export const removePostFromChannel = async (channel_ID, post_ID) => {
  try {
    //const channel = await Channel.find({ _id: channel_ID, posts: { content: post_ID } });
    const updatedChannel = await Channel.findOneAndUpdate(
      { _id: channel_ID },
      { $pull: { posts: { content: post_ID } } }
    );
    //console.log(updatedChannel);
    return updatedChannel;
  } catch (err) {
    console.log(`removePostFromChannel, ${id} (${err.message})`);
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

export const getChannelByName = async (name) => {
  try {
    const channel = await Channel.findOne({ name: name });
    return channel;
  } catch (err) {
    console.log(`get channel by name service, ${name} (${err.message})`);
  }
};

export const isNameAvailable = async (name) => {
  if (!name) {
    console.log(name);
    return false;
  }
  const channel = await Channel.findOne({ name: name });
  //console.log(channel);
  //console.log(`Ho cercato il canale, ecco la sua negazione: ${!channel}`);
  return !channel;
};

export const createChannel = async (newChannel) => {
  try {
    const check = await Channel.findOne({ name: newChannel.name });
    if (!!check) return { status: "fail" };
    const item = new Channel(newChannel);
    item.save();
    return { status: "success" };
  } catch (err) {
    console.log(`createChannel service, ${newChannel} (${err.message})`);
  }
};

export const isPostInChannel = async (channel_ID, post_ID) => {
  try {
    const channel = await Channel.findOne({ _id: channel_ID });
    const post = channel.posts.find((post) => post.content == post_ID);
    return post;
  } catch (err) {
    console.log(`isPostInChannel service, ${channel_ID} (${err.message})`);
  }
};
