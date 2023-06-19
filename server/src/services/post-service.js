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

export const savePost = async (postData) => {
  try {
    const post = new Post(postData);
    await post.save();
    return { status: "success" };
  } catch (err) {
    console.log(`save post service, ${postData.id} (${err.message})`);
    return { status: "failure" };
  }
};

export const searchBody = async (keyword) => {
  try {
    const posts = await Post.find({ text: { $regex: keyword } });
    return posts;
  } catch {
    console.log(`search body, ${keyword} (${err.message})`);
    return { status: "failure" };
  }
};

export const createPost = async (post) => {
  try {
    const newPost = new Post(post);
    const postId = newPost.save();
    return newPost._id;
  } catch {
    console.log(`create post service, (${err.message})`);
    return { status: "failure" };
  }
};

export const filterAllPosts = async (sender, recipients, start_time, end_time) => {
  try {
    //console.log(sender, recipients, start_time, end_time);
    let query = {};
    if (sender) query.sender = sender;
    if (recipients && recipients?.length > 0) query.recipients = { $in: recipients };
    if (!!start_time && !!end_time) query.timestamp = { $gte: start_time, $lte: end_time };
    else if (end_time) query.timestamp = { $lte: end_time };
    else if (start_time) query.timestamp = { $gte: start_time };
    console.log("recipients:",recipients);
    console.log("query:",query);

    const posts = await Post.find(query).sort({ timestamp: -1 });
    return posts;
  } catch (err) {
    console.log(`filter all posts service, (${err.message})`);
    return { status: "failure" };
  }
};

export const removeRecipient = async (postId, recipient) => {
  try {
    const post = await Post.findOne({ _id: postId });
    post.recipients = post.recipients.filter((r) => r !== recipient);
    post.save();
    return { status: "success" };
  } catch (err) {
    console.log(`remove recipient service, (${err.message})`);
    return { status: "failure" };
  }
}