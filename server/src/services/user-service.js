import { Channel } from "../models/Channel.js";
import { User } from "../models/User.js";
import {
  getChannelPosts,
  channelIdToName,
} from "../services/channel-service.js";

export const getUserHome = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    const posts = await Promise.all(
      user.channels.map(async (item) => {
        const new_posts = await getChannelPosts(item._id);
        return new_posts;
      })
    );
    return posts.flat();
  } catch (err) {
    console.log(`Update likes service, ${id} (${err.message})`);
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
    return {
      valid_credentials: true,
      //username: result[0].username,
      id: result[0]._id.toString(),
    };
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
