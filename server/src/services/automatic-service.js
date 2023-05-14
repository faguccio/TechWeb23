import * as postService from "./post-service.js";
import * as channelService from "./channel-service.js";
import * as Const from "../const.js";
import axios from "axios";
import mongoose from "mongoose";

const limit = 1;
const config = {
  headers: {
    "X-Api-Key": Const.ninja_api_key,
  },
};

export const automatic = async () => {
  console.log("Here");

  const jokes = await getJokesApi(limit);
  await savePosts(jokes, "§JOKESQEUAL", "joke");
  const facts = await getFactsApi(limit);
  await savePosts(facts, "§FACTSQUEAL", "fact");
};

const getJokesApi = async (limit) => {
  const res = await axios.get(
    `https://api.api-ninjas.com/v1/jokes?limit=${limit}`,
    config
  );
  return res.data;
};

const getFactsApi = async (limit) => {
  const res = await axios.get(
    `https://api.api-ninjas.com/v1/facts?limit=${limit}`,
    config
  );
  return res.data;
};

const formatPost = (postBody, varToGet) => {
  const post = {
    _id: new mongoose.Types.ObjectId(),
    sender: new mongoose.Types.ObjectId("64569d259d19f7f3611babe0"), //admin
    recipients: [],
    text: postBody[varToGet],
    timestamp: Date.now(),
  };

  return post;
};

const savePosts = async (posts, channelName, varToGet) => {
  posts.map(async (post) => {
    post = formatPost(post, varToGet);
    await postService.savePost(post);
    await channelService.addPostToChannelByName(
      channelName,
      post._id,
      post.timestamp
    );
  });
};
