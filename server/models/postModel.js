import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2024/04/01/14/58/sierra-del-torcal-8669125_1280.jpg",
    },
    category: {
      type: String,
      enum: [
        "education",
        "entertainment",
        "health",
        "science",
        "sports",
        "technology",
      ],
    },
    like: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const postModel = mongoose.model("Post", postSchema);
