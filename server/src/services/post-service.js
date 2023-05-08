import { Post } from "../models/Post.js";

export const updateLike = async (id, field, amount) => {
  try {
    const post = await Post.findOne({ _id: id });
    post["reactions"][field] += amount;
    post.save();
  } catch (err) {
    console.log(`Update likes service, ${id} (${err.message})`);
  }
};

/*
export const updatePost = async (id, changes) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    
    for (key in changes) {
      console.log(post[key]);
    }
    post.save();
  } catch (err) {
    console.log(`Update likes, ${id} (${err.message})`);
  }
};
*/
