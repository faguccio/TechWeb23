import mongoose from "mongoose";
const { Schema } = mongoose;
import * as Const from "../const.js";

const userSchema = new Schema({
  name: { type: String, required: true },

  password: { type: String, required: true },
  type: {
    type: String,
    default: "normal",
    enum: ["normal", "vip", "manager", "admin"],
  }, //Normal, Pro, Manager, Moderator
  blocked_flag: { type: Boolean, default: false }, //true if user is blocked
  managing: { type: mongoose.Types.ObjectId, default: null }, //account which I'm managing, ignore if type not manager
  card_number: { type: String, default: null }, //credit card number

  propic_path: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },

  posts: { type: [mongoose.Types.ObjectId], default: [] },
  posts_received: { type: [mongoose.Types.ObjectId], default: [] },
  channels: { type: [mongoose.Types.ObjectId], default: [] },
  postsLiked: { type: [mongoose.Types.ObjectId], default: [] },
  postsDisliked: { type: [mongoose.Types.ObjectId], default: [] },

  popularPosts: { type: [mongoose.Types.ObjectId], default: [] },
  unpopularPosts: { type: [mongoose.Types.ObjectId], default: [] },
  controversialPosts: { type: [mongoose.Types.ObjectId], default: [] },

  leftovers_chars: {
    type: {
      day: Number,
      week: Number,
      month: Number,
    },
    default: { ...Const.standard_chars },
  },
});

export const User = mongoose.model("User", userSchema);
