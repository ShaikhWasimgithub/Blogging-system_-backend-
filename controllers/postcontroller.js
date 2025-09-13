import { get } from "mongoose";
import Post from "../models/Post.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, status } = req.body;
    const post = new Post({
      title,
      content,
      category,
      tags: tags || [],
      status: status || "draft",
      author: req.user.id,
    });
    await post.save();
    await post.populate("author", "username email");
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get posts with pagination, filters
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (!req.user || req.user.role !== "admin") filter.status = "published";
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username email")
      .populate("category", "name")
      .populate("tags", "name");

    return res.json({
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("category", "name")
      .populate("tags", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.status === "draft") {
      const user = req.user;
      if (!user) return res.status(403).json({ message: "Access denied" });
      if (user.role !== "admin" && post.author._id.toString() !== user.id)
        return res.status(403).json({ message: "Access denied" });
    }

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.user.role !== "admin" && post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "You cannot edit this post" });

    ["title", "content", "category", "tags", "status"].forEach((f) => {
      if (req.body[f] !== undefined) post[f] = req.body[f];
    });

    await post.save();
    await post.populate("author", "username email");
    return res.json(post);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.user.role !== "admin" && post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "You cannot delete this post" });

    await Post.findByIdAndDelete(id);
    return res.json({ message: "Post deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
