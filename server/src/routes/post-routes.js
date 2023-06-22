import * as Const from "../const.js";
import * as postService from "../services/post-service.js";
import * as userService from "../services/user-service.js";
import * as channelService from "../services/channel-service.js";
import { Channel } from "../models/Channel.js";
import { Post } from "../models/Post.js";
import { addPostToChannel } from "./channel-routes.js";

import { User } from "../models/User.js";

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
      let channels = await postService.searchChannel(keyword);
      channels = channels.map((chan) => chan.name);

      return res
        .status(Const.STATUS_OK)
        .json({ posts: posts, channels: channels });
    }
  } catch (err) {
    console.log(`search post body, (${err.message})`);
  }
};

export const createPost = async (req, res) => {
  try {
    const newPost = req.body;
    console.log(newPost.sender);
    const userId = !!newPost.sender ? newPost.sender : req.authData.id;
    console.log(userId);
    newPost.sender = userId;

    const postId = await postService.createPost(newPost);

    for (const recipient of newPost.recipients) {
      if (recipient[0] === "@") {
        // Controlla che l'utente esista
        const recipientUsername = recipient.substring(1);
        const recipientId = await userService.userNameToId(recipientUsername);

        if (recipientId) {
          await userService.addPostToRecieved(recipientId, postId);
        } else {
          // L'utente non esiste, gestisci l'errore di conseguenza
          console.log(`Utente non trovato: ${recipientUsername}`);
          // Puoi inviare una risposta di errore al client se necessario
          return res
            .status(Const.STATUS_BAD_REQUEST)
            .json({ error: "L'utente non esiste" });
        }
      } else if (recipient[0] === "#") {
        // Verifica che il canale esista
        const checkChannelExists = async (channelName) => {
          const channelProva = await Channel.findOne({ name: channelName });
          console.log(channelProva);
          if (channelProva) {
            return true;
          } else {
            return false;
          }
        };
        const channelName = recipient;
        const channelExists = await checkChannelExists(channelName);
        console.log(channelExists + "post");
        if (channelExists) {
          // TODO: Controlla l'accesso al canale
          await channelService.addPostToChannelByName(
            recipient,
            postId,
            newPost.timestamp
          );
        } else {
          // Non esiste quindi crealo
          const status = await channelService.createChannel({
            name: channelName,
            description: "",
          });
          console.log("canale non esistente creato");
          if (status.status === "success") {
            const channelId = await channelService.channelNameToId(channelName);
            await channelService.addPostToChannel(
              channelId,
              postId,
              newPost.timestamp
            );
          } else {
            console.log(`Impossibile creare il canale: ${channelName}`);
            // Puoi inviare una risposta di errore al client se necessario
            return res
              .status(Const.STATUS_BAD_REQUEST)
              .json({ error: "Impossibile creare il canale" });
          }
        }
      } else if (recipient[0] === "§") {
        console.log(`Canale non trovato: ${recipient}`);
        return res
          .status(Const.STATUS_BAD_REQUEST)
          .json({ error: "Canale non esiste" });
      }
    }

    newPost.text
      .split(" ")
      .filter((word) => {
        return word[0] == "#";
      })
      .map((chName) =>
        channelService.createChannel({
          name: chName,
          description: "",
        })
      );

    console.log(userId, postId);
    userService.addPostToUser(userId, postId);
    res
      .status(Const.STATUS_OK)
      .json({ status: "success", msg: "Post created successfully" });
  } catch (err) {
    console.log(`createPost route, (${err.message})`);
    return res
      .status(Const.STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: "Errore durante la creazione del post" });
  }
};

export const createComment = async (req, res) => {
  try {
    const userId = req.authData.id;
    const postId = req.params.id;
    const comment = req.body.text;
    const userName = await userService.userIdToName(userId);

    await postService.createComment(comment, postId, userName);
    res
      .status(Const.STATUS_OK)
      .json({ status: "success", msg: "Comment created successfully" });
  } catch (err) {
    console.log(`createComment route, (${err.message})`);
  }
};

export const createCommentManager = async (req, res) => {
  try {
    const userId = req.authData.id;
    const postId = req.params.id;
    const comment = req.body.text;
    let name = "";
    const manager = await User.findOne({ _id: userId });
    if (!!manager.managing) {
      const managed = await User.findOne({ _id: manager.managing });
      name = managed.name;
    } else {
      name = manager.name;
    }
    await postService.createComment(comment, postId, name);
    res
      .status(Const.STATUS_OK)
      .json({ status: "success", msg: "Comment created successfully" });
  } catch (err) {
    console.log(`createCommentManager route, (${err.message})`);
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
export const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const newPost = req.body;
    const updatedPost = await Post.findByIdAndUpdate(postId, newPost);
    res
      .status(Const.STATUS_OK)
      .json({ message: "Post updated successfully", status: "success" });
  } catch (err) {
    console.log(`updatePostById route, (${err.message})`);
  }
};

export const getAllPostFiltered = async (req, res) => {
  try {
    let sender = req.query?.sender; // sender = ObjectId(...) || null/undefined
    let recipients = req.query?.recipients; // recipients = 'a, b, c, ...' || null/undefined
    if (recipients) {
      //console.log("getAllPost - recipients: ", recipients);
      //recipients = decodeURIComponent(recipients);
      recipients = recipients.split(",").map((recipient) => recipient.trim());
    }
    let start_time = req.query?.start_time; // start_time = ISODate(...) || null/undefined
    let end_time = req.query?.end_time; // end_time = ISODate(...) || null/undefined

    const posts = await postService.filterAllPosts(
      sender,
      recipients,
      start_time,
      end_time
    );
    res.status(Const.STATUS_OK).json(posts);
  } catch (err) {
    console.log(`getAllPostFiltered route, (${err.message})`);
    return res.status(Const.STATUS_UNAUTHORIZED).json({ error: err.message });
  }
};

export const getAllPostByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ sender: userId }).sort({ timestamp: -1 });
    res.status(Const.STATUS_OK).json(posts);
  } catch (err) {
    console.log(`getAllPostByUserId route, (${err.message})`);
  }
};

export const getAllPostOfManaged = async (req, res) => {
  try {
    const userId = req.authData.id;
    const user = await User.findOne({ _id: userId });
    let posts = [];
    if (!!user.managing) {
      posts = await postService.getAllPostOfManaged(userId);
    } else {
      posts = await Post.find({ sender: userId }).sort({ timestamp: -1 });
      posts = posts.map((post) => {
        return post._id;
      });
    }
    res.status(Const.STATUS_OK).json(posts);
  } catch (err) {
    console.log(`getAllPostOfManaged route, (${err.message})`);
  }
};
