import { updateLike } from "../services/post-service.js";
import * as Const from "../const.js";

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
