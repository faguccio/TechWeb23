import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  propic_path: String,

  posts: [mongoose.Types.ObjectId],
  posts_received: [mongoose.Types.ObjectId],
  channels: [mongoose.Types.ObjectId],

  leftovers_chars: {
    day: Number,
    week: Number,
    month: Number,
  },
  standard_chars: {
    day: Number,
    week: Number,
    month: Number,
  },
});

export const User = mongoose.model("User", userSchema);
