import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
  name: String,
  posts: [mongoose.Types.ObjectId],
  propic_path: String,
});

export const User = mongoose.model("User", postSchema);
