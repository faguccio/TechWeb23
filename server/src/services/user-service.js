import { get } from "mongoose";
import { Channel } from "../models/Channel.js";
import { User } from "../models/User.js";
import {
  getChannelPosts,
  channelIdToName,
  getChannelPostsUn,
} from "../services/channel-service.js";
import { getUserPostsStats } from "./post-service.js";

export const getUserHome = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    const posts = await Promise.all(
      user.channels.map(async (item) => {
        const new_posts = await getChannelPostsUn(item._id);
        return new_posts;
      })
    );
    posts.push(user.posts_received);
    const ordPosts = posts
      .flat()
      .sort((objA, objB) => Number(objB.timestamp) - Number(objA.timestamp))
      .map((post) => post.content);
    console.log(ordPosts);
    return ordPosts;
  } catch (err) {
    console.log(`getUserHome service, ${id} (${err.message})`);
  }
};

export const getStandardHome = async () => {
  try {
    const posts = await Promise.all(
      ["§JOKESQUEAL", "§FACTSQUEAL", "§CONTROVERSIAL"].map(async (item) => {
        const channel = await Channel.findOne({ name: item });
        const new_posts = await getChannelPosts(channel._id);
        return new_posts;
      })
    );
    return posts.flat();
  } catch (err) {
    console.log(`getStandardHome service, ${id} (${err.message})`);
  }
};

export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const res = await user.save();
    return { status: "success" };
  } catch (err) {
    console.log(`creatingUser service, (${err.message})`);
  }
};

export const verifyLogin = async (name, password) => {
  const result = await User.find({ name: name, password: password });

  if (result.length == 0)
    return {
      valid_credentials: false,
      message: "invalid username or password",
    };
  else {
    //console.log("result ",result);
    if (result[0].type == "manager" || result[0].type == "vip") {
      return {
        valid_credentials: true,
        id: result[0]._id.toString(),
        isPro: true,
        isAdmin: false,
      };
    } else {
      if (result[0].type == "admin") {
        return {
          valid_credentials: true,
          id: result[0]._id.toString(),
          isPro: false,
          isAdmin: true,
        };
      } else {
        return {
          valid_credentials: true,
          id: result[0]._id.toString(),
          isPro: false,
          isAdmin: false,
        };
      }
    }
  }
};

export const getUserChannels = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    const names = await Promise.all(
      user.channels.map(async (chan) => {
        const name = await channelIdToName(chan);
        return name;
      })
    );
    return names;
  } catch (err) {
    console.log(`getUser (by id), ${id} (${err.message})`);
  }
};

export const addPostToUser = async (userId, postId) => {
  try {
    const user = await User.findOne({ _id: userId });
    user.posts.push(postId);
    user.save();
  } catch (err) {
    console.log(`addPostToUser, ${postId} (${err.message})`);
  }
};

export const addPostToRecieved = async (userId, postId) => {
  try {
    const user = await User.findOne({ _id: userId });
    user.posts_received.push({ content: postId, timestamp: new Date() });
    user.save();
  } catch (err) {
    console.log(`addPostToUser, ${postId} (${err.message})`);
  }
};

export const userNameToId = async (name) => {
  try {
    const user = await User.findOne({ name: name });
    if (!user) return null;
    return user._id;
  } catch (err) {
    console.log(`userNameToId, service ${name} (${err.message})`);
  }
};

export const userIdToName = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return null;
    return user.name;
  } catch (err) {
    console.log(`userIdToName, service ${id} (${err.message})`);
  }
};

export const usersContainingName = async (str) => {
  try {
    const users = await User.find({ name: { $regex: str, $options: "i" } });
    if (!users) return null;
    return users;
  } catch (err) {
    console.log(`usersContainingName, service ${str} (${err.message})`);
  }
};

export const usersIsType = async (type) => {
  try {
    const users = await User.find({ type: type });
    if (!users) return null;
    return users;
  } catch (err) {
    console.log(`usersContainingName, service ${str} (${err.message})`);
  }
};

export const filterAll = async (type, name, popularity) => {
  try {
    const users = await User.find({
      name: { $regex: name, $options: "i" },
      type: { $regex: type },
    });
    if (!users) return null;
    return users;
  } catch (err) {
    console.log(`usersContainingName, service ${type} (${err.message})`);
  }
};
//TODO user is popular
export const getUserStats = async (id) => {
  try {
    const stats = await getUserPostsStats(id);
    return stats;
  } catch (err) {
    console.log(`getUserStats, service ${id} (${err.message})`);
  }
};
