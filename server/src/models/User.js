import mongoose from "mongoose";
const { Schema } = mongoose;
import * as Const from "../const.js";

const userSchema = new Schema({
  name: { type: String, required: true },

  password: { type: String, required: true },
  type: { type: String, default: "normal", enum: ["normal", "vip", "manager"]}, //Normal, VIP or Manager
  managing: { type: mongoose.Types.ObjectId, default: null }, //account which I'm managing, ignore if type not manager

  propic_path: {
    type: String,
    default:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/78d0bcc3-418b-4f9c-a3bb-27afbe816c03/de8qqfg-5a5e39c2-bb68-4572-8f43-37d784543d21.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc4ZDBiY2MzLTQxOGItNGY5Yy1hM2JiLTI3YWZiZTgxNmMwM1wvZGU4cXFmZy01YTVlMzljMi1iYjY4LTQ1NzItOGY0My0zN2Q3ODQ1NDNkMjEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9aNaVlCVUluDPN3pHuRKWAuS4JPA5AC0jfKBohK6iKw",
  },

  posts: { type: [mongoose.Types.ObjectId], default: [] },
  posts_received: { type: [mongoose.Types.ObjectId], default: [] },
  channels: { type: [mongoose.Types.ObjectId], default: [] },

  leftovers_chars: {
    type: {
      day: Number,
      week: Number,
      month: Number,
    },
    default: { ...Const.standard_chars },
  },

  standard_chars: {
    type: {
      day: Number,
      week: Number,
      month: Number,
    },
    default: { ...Const.standard_chars },
  },
});

export const User = mongoose.model("User", userSchema);
