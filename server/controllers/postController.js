import { upload } from "../helper/multer.js";
import { postModel } from "../models/postModel.js";
import { userModel } from "../models/userModel.js";

// Create Post
export const createPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const thumbnail = req.file?.name;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const existPost = await postModel.findOne({ title });
    if (existPost) {
      return res.status(400).json({ message: "Post already exists" });
    }
    const newPost = await new postModel({
      title,
      description,
      category,
      thumbnail,
      author: req.user.id,
    }).save();
    await userModel.findByIdAndUpdate(
      req.user.id,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    res.status(200).json({ message: "post created", newPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Thumbnail upload
export const uploadThumbnail = async (req, res, next) => {
  try {
    upload.single("thumbnail")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error uploading file", error: err.message });
      }
    });
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Posts

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .sort({ updatedAt: -1 })
      .populate([{ path: "author" }, { path: "category" }]);
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Single Post

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel
      .findById(id)
      .populate([{ path: "author" }, { path: "category" }]);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Post By Category

export const getCategoryPost = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await postModel
      .find({ category })
      .sort({ updatedAt: -1 })
      .populate("author");
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this category" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Author Post

export const getAuthorPost = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await postModel.find({ author: id }).sort({ uploadedAt: -1 });
    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: "Posts not found for this author" });
    }
    res.status(200).json({ message: "Posts found", posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit Post

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const thumbnail = req.file?.filename;

    // Find the post by ID
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to edit the post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update the post
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { title, description, category, thumbnail },
      { new: true }
    );

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Post

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;

    // Find the post by ID
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user is authorized to delete the post
    if (post?.author.toString() !== authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // If authorized, delete the post
    await postModel.findByIdAndDelete(id);

    // Remove the post ID from the user's posts array
    await userModel.findByIdAndUpdate(authorId, { $pull: { posts: id } });
    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
