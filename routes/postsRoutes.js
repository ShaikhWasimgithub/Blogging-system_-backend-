import express from "express";
import postController from "../controllers/postcontroller.js";
import auth from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Optional Auth Middleware
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next();
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // ignore invalid token
  }
  next();
};

// Public (optional auth)
router.get("/", optionalAuth, postController.getPosts);
router.get("/:id", optionalAuth, postController.getPostById);

// Auth required
router.post("/", auth, postController.createPost);
router.put("/:id", auth, postController.updatePost);
router.delete("/:id", auth, postController.deletePost);

export default router;
