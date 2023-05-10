import mongoose from "mongoose";
const { Schema } = mongoose;

const channelSchema = new Schema({
  name: String,

  owners: [mongoose.Types.ObjectId],
  allowed_readers: [mongoose.Types.ObjectId],
  allowed_writers: [mongoose.Types.ObjectId],

  posts: [mongoose.Types.ObjectId],
});

export const Channel = mongoose.model("Channel", channelSchema);
