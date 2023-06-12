import mongoose from "mongoose";
const { Schema } = mongoose;

const channelSchema = new Schema({
  name: { type: String, required: true },

  owners: { type: [mongoose.Types.ObjectId], default: [] },
  allowed_readers: { type: [mongoose.Types.ObjectId], default: [] },
  allowed_writers: { type: [mongoose.Types.ObjectId], default: [] },

  posts: {
    type: [{ content: mongoose.Types.ObjectId, timestamp: Date }],
    default: [],
  },
});

export const Channel = mongoose.model("Channel", channelSchema);
