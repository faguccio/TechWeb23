import mongoose from "mongoose";
import { Post } from "./Post.js";
const { Schema } = mongoose;

const channelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },

  owners: { type: [mongoose.Types.ObjectId], default: [] },
  allowed_readers: { type: [mongoose.Types.ObjectId], default: [] },
  allowed_writers: { type: [mongoose.Types.ObjectId], default: [] },

  posts: {
    type: [{ 
      content: { type: mongoose.Types.ObjectId, ref: 'Post' }, 
      timestamp: Date 
    }],
    default: [],
  },
});

export const Channel = mongoose.model("Channel", channelSchema);
