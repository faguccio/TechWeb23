import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
  sender: mongoose.Types.ObjectId,
  recipients: [String],
  text: String,
  timestamp: { type: Date, required: true },
  image_path: { type: String, default: null },
  geolocation: { lat: Number, lon: Number },
  reactions: {
    type: { positive: Number, negative: Number },
    default: { positive: 0, negative: 0 },
  },
  impressions: { type: Number, default: 0 },
  impressionsIds: { type: [String], default: [] },
});

//postSchema.index({ text: "text" });

export const Post = mongoose.model("Post", postSchema);
