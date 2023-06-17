import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

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
  const updatedUser = await user.save();
  const updatedPost = await post.save();
  calculatePostStatus(updatedPost, updatedUser);
}

async function calculatePostStatus(post, user) {
  //here i should calculate the gaining or losing of characters
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
  } catch {
    console.log(`getPost service, (${err.message})`);
    return { status: "failure" };
  }
};
