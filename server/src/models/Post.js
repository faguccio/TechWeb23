import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
  sender: mongoose.Types.ObjectId,
  recipients: [String],
  text: String,
  timestamp: Date,
  image_path: String,
  geolocation: { lat: Number, lon: Number },
  reactions: { positive: Number, negative: Number },
});

export const Post = mongoose.model("Post", postSchema);
