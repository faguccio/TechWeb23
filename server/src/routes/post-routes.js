import * as Const from "../const.js";
import * as postService from "../services/post-service.js";
import * as userService from "../services/user-service.js";
import * as channelService from "../services/channel-service.js";

export const useLike = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.authData.id;
    const body = req.body;

    if (body.type !== "positive" && body.type !== "negative")
      return res.status(Const.BAD_REQUEST).json({ result: "BAD-BODY" });

    await postService.updateLike(id, userId, body.type);
    return res.status(Const.STATUS_OK).json({ result: "success" });
  } catch (err) {
    console.log(`Update likes route, ${id} (${err.message})`);
  }
};

/*export const getHomePagePosts = async (req, res, next) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const user = req.params.id;

  try {
    let allPages = 
    const pageContent = allPages.slice(startIndex, endIndex);
    const ret = pageContent;
    return res.status(Const.STATUS_OK).json(ret);
  } catch (err) {
    console.log(`get home page post, ${user} (${err.message})`);
  }
};*/

export const searchPostBody = async (req, res) => {
  const keyword = req.query.kw;

  try {
    if (keyword) {
      let posts = await postService.searchBody(keyword);
      posts = posts.map((post) => post._id);
      return res.status(Const.STATUS_OK).json(posts);
    }
  } catch (err) {
    console.log(`search post body, (${err.message})`);
  }
};

export const createPost = async (req, res) => {
  try {
    const userId = req.authData.id;
    const newPost = req.body;
    newPost.sender = userId;

    const postId = await postService.createPost(newPost);

    newPost.recipients.map(async (recipient) => {
      if (recipient[0] == "@") {
        //TODO controllare che l'utente esista
        userService.addPostToRecieved(postId);
      } else {
        //TODO controllare che il canale esista
        //TODO controllare accesso al canale
        channelService.addPostToChannelByName(
          recipient,
          postId,
          newPost.timestamp
        );
      }
    });

    console.log(userId, postId);
    userService.addPostToUser(userId, postId);
    res
      .status(Const.STATUS_OK)
      .json({ status: "success", msg: "Post created successfully" });
  } catch (err) {
    console.log(`createPost route, (${err.message})`);
  }
};

export const getPost = async (req, res) => {
  try {
    const sessionId = req.headers["my-unique-session"];
    const post = await postService.getPost(req.params.id, sessionId);
    return res.status(200).json(post);
  } catch (err) {
    console.log(`get post, ${req.params.id} (${err.message})`);
  }
};
