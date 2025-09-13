import express from "express";
import categoryController from "../controllers/categorycontroller.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", categoryController.getCategories);

// Admin only
router.post("/", auth, role(["admin"]), categoryController.createCategory);
router.put("/:id", auth, role(["admin"]), categoryController.updateCategory);
router.delete("/:id", auth, role(["admin"]), categoryController.deleteCategory);

export default router;
