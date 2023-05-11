import { Channel } from "../models/Channel.js";
import { User } from "../models/User.js";
import { getChannelPosts } from "../services/channel-service.js";

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
  if (result.length !== 1) return "invalid username or password";

  return {
    username: result[0].username,
    id: result[0]._id.toString(),
  };
};
