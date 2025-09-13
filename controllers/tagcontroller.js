import Tag from "../models/Tag.js";

// Create tag (admin)
export const createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    return res.status(201).json(tag);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get tags public ye public hota hai   GET API
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    return res.json(tags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update tag (only admin) PUT API
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Tag.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Tag not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete tag (admin)
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await Tag.findByIdAndDelete(id);
    return res.json({ message: "Tag deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export default {
  createTag,
  getTags,
  updateTag,
  deleteTag,
};
