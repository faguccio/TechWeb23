import { updateLike } from "../services/post-service.js";
import * as Const from "../const.js";
import { getUserHome } from "../services/user-service.js";
import * as postService from "../services/post-service.js";

export const useLike = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    if (body.type !== "positive" && body.type !== "negative")
      return res.status(Const.BAD_REQUEST).json({ result: "BAD-BODY" });

    const sign = body.increase ? 1 : -1;

    await updateLike(id, body.type, sign);
    return res.status(Const.STATUS_OK).json({ result: null });
  } catch (err) {
    console.log(`Update likes route, ${id} (${err.message})`);
  }
};

export const getHomePagePosts = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const user = req.params.id;

  try {
    let allPages = await getUserHome(user);
    const pageContent = allPages.slice(startIndex, endIndex);
    const ret = pageContent;
    return res.status(Const.STATUS_OK).json(ret);
  } catch (err) {
    console.log(`get home page post, ${user} (${err.message})`);
  }
};

export const searchPostBody = async (req, res) => {
  const keyword = req.query.kw;

  try {
    if (keyword) {
      let posts = await postService.searchBody(keyword);
      posts = posts.map((post) => post._id);
      return res.status(Const.STATUS_OK).json(posts);
    }
  } catch {
    console.log(`search post body, (${err.message})`);
  }
};
