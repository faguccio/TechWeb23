import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import * as Const from "../const.js";
import * as channelService from "./channel-service.js";
import mongoose, { Mongoose } from "mongoose";

export const updateLike = async (id, userId, type) => {
  try {
    if (type === "positive") {
      addPostive(id, userId);
    }

    if (type === "negative") {
      addNegative(id, userId);
    }
  } catch (err) {
    console.log(`Update likes service, ${id} (${err.message})`);
  }
};

async function addPostive(postId, userId) {
  const post = await Post.findOne({ _id: postId });
  const user = await User.findOne({ _id: userId });

  if (!user.postsLiked.includes(postId)) {
    user.postsLiked.push(postId);
    if (user.postsDisliked.includes(postId)) {
      user.postsDisliked = user.postsDisliked.filter((myid) => {
        return myid != postId;
      });
      post.reactions.negative -= 1;
    }
    post.reactions.positive += 1;
  } else {
    user.postsLiked = user.postsLiked.filter((myid) => {
      return myid != postId;
    });
    post.reactions.positive -= 1;
  }

  const updatedUser = await user.save();
  const updatedPost = await post.save();
  calculatePostStatus(updatedPost, updatedUser);
}

async function addNegative(postId, userId) {
  const post = await Post.findOne({ _id: postId });
  const user = await User.findOne({ _id: userId });

  if (!user.postsDisliked.includes(postId)) {
    user.postsDisliked.push(postId);
    if (user.postsLiked.includes(postId)) {
      user.postsLiked = user.postsLiked.filter((myid) => {
        return myid != postId;
      });
      post.reactions.positive -= 1;
    }
    post.reactions.negative += 1;
  } else {
    post.reactions.negative -= 1;
    user.postsDisliked = user.postsDisliked.filter((myid) => {
      return myid != postId;
    });
  }
  await user.save();
  const updatedPost = await post.save();
  calculatePostStatus(updatedPost);
}

async function calculatePostStatus(post) {
  const user = await User.findOne({ _id: post.sender });
  const upvotes = post.reactions.positive;
  const downvotes = post.reactions.negative;
  const MC = post.impressions * Const.critic_mass_index;

  user.popularPosts = user.popularPosts.filter((id) => {
    return String(id) != String(post._id);
  });
  user.unpopularPosts = user.unpopularPosts.filter((id) => {
    return String(id) != String(post._id);
  });
  user.controversialPosts = user.controversialPosts.filter((id) => {
    return String(id) != String(post._id);
  });

  if (upvotes > MC && downvotes > MC) {
    user.controversialPosts.push(post._id);
    const channel_ID = await channelService.channelNameToId("§CONTROVERSIAL");
    await channelService.addPostToChannel(channel_ID, post._id, post.timestamp);
  } else if (upvotes > MC) {
    user.popularPosts.push(post._id);
    if (user.popularPosts.length >= 10) {
      ["day", "week", "month"].map((field) => {
        user.leftovers_chars[field] += Const.standard_chars[field] * 0.05;
      });
    }
  } else if (downvotes > MC) {
    user.unpopularPosts.push(post._id);
    if (user.unpopularPosts.length >= 3) {
      ["day", "week", "month"].map((field) => {
        user.leftovers_chars[field] -= Const.standard_chars[field] * 0.05;
      });
    }
  }

  await user.save();
}

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

export const getPost = async (postId, sessionId) => {
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post.impressionsIds.includes(sessionId)) {
      post.impressionsIds.push(sessionId);
      post.impressions += 1;
      await post.save();
    }
    delete post.impressionsIds;
    return post;
  } catch (err) {
    console.log(`getPost service, (${err.message})`);
    return { status: "failure" };
  }
};

export const getAllPostOfManaged = async (userId) => {
  try {
    const manager = await User.findOne({ _id: userId });
    const managed = await User.findOne({ _id: manager.managing });

    return managed.posts;
  } catch (err) {
    console.log(`getAllPostOfManaged service, (${err.message})`);
    return { status: "failure" };
  }
};

export const createComment = async (comment, postId, userName) => {
  try {
    const updatedPost = await Post.findOne({ _id: postId });
    const newComment = userName + "\n" + comment;
    if (!updatedPost.comments.includes(newComment)) {
      updatedPost.comments.push(newComment);
    }
    await updatedPost.save();
    return { status: "success" };
  } catch (err) {
    console.log(`createComment service, (${err.message})`);
    return { status: "failure" };
  }
};
export const filterAllPosts = async (
  sender,
  recipients,
  start_time,
  end_time
) => {
  try {
    //console.log(sender, recipients, start_time, end_time);
    let query = {};
    if (sender) query.sender = sender;
    if (recipients && recipients?.length > 0)
      query.recipients = { $in: recipients };
    if (!!start_time && !!end_time)
      query.timestamp = { $gte: start_time, $lte: end_time };
    else if (end_time) query.timestamp = { $lte: end_time };
    else if (start_time) query.timestamp = { $gte: start_time };
    //console.log("recipients:", recipients);
    //console.log("query:", query);

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
    post.recipients.pull(recipient);
    post.save();
    return { status: "success" };
  } catch (err) {
    console.log(`remove recipient service, (${err.message})`);
    return { status: "failure" };
  }
};

export const addRecipient = async (postId, recipient) => {
  try {
    const post = await Post.findOne({ _id: postId });
    post.recipients.push(recipient);
    post.save();
    return { status: "success" };
  } catch (err) {
    console.log(`add recipient service, (${err.message})`);
    return { status: "failure" };
  }
};

export const getUserPostsStats = async (userId) => {
  try {
    const id = new mongoose.Types.ObjectId(userId);
    
    const totalLikes = await Post.aggregate([
      { $match: { sender: id } },
      { $group: { _id: null, total: { $sum: "$reactions.positive" } } },
    ]);
    const totalDislikes = await Post.aggregate([
      { $match: { sender: id } },
      { $group: { _id: null, total: { $sum: "$reactions.negative" } } },
    ]);
    const totalComments = await Post.aggregate([
      { $match: { sender: id } },
      { $group: { _id: null, total: { $sum: { $size: "$comments" } } } },
    ]);
    const totalImpressions = await Post.aggregate([
      { $match: { sender: id } },
      { $group: { _id: null, total: { $sum: "$impressions" } } },
    ]);
    const totalPosts = await Post.aggregate([
      { $match: { sender: id } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);
    const maxValues = await Post.aggregate([
      { $match: { sender: id } },
      {
        $group: {
          _id: null,
          maxLikes: { $max: '$reactions.positive' },
          maxImpressions: { $max: '$impressions' },
          maxComments: { $max: { $size: '$comments' } }
        }
      }
    ]);
    const { maxLikes, maxImpressions, maxComments } = maxValues[0];

    //console.log( totalLikes, totalDislikes, totalComments, totalImpressions, totalPosts);
    
    return {
      totalLikes: totalLikes[0]?.total || 0,
      totalDislikes: totalDislikes[0]?.total || 0,
      totalComments: totalComments[0]?.total || 0,
      totalImpressions: totalImpressions[0]?.total || 0,
      totalPosts: totalPosts[0]?.total || 0,
      maxLikes: maxLikes || 0,
      maxImpressions: maxImpressions || 0,
      maxComments: maxComments || 0
    };
  } catch (err) {
    console.log(`user posts stats service, (${err.message})`);

  }
};