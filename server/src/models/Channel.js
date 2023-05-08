import mongoose from "mongoose";
const { Schema } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
  },

  owners: [mongoose.Types.ObjectId],
  allowed_readers: [mongoose.Types.ObjectId],
  allowed_writers: [mongoose.Types.ObjectId],

  posts: [mongoose.Types.ObjectId],
});

export const Post = mongoose.model("Post", channelSchema);
