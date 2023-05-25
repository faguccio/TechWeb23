import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
  sender: mongoose.Types.ObjectId,
  recipients: [String],
  text: String,
  timestamp: { type: Date, required: true },
  image_path: String,
  geolocation: { lat: Number, lon: Number },
  reactions: {
    type: { positive: Number, negative: Number },
    default: { positive: 0, negative: 0 },
  },
});

//postSchema.index({ text: "text" });

export const Post = mongoose.model("Post", postSchema);
