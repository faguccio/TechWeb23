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
