// routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  getProfile,
  updateUserRole,
} from "../controllers/usercontroller.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get own profile
router.get("/me", auth, getProfile);

// Admin: list all users and update roles
router.get("/", auth, role(["admin"]), getAllUsers);
router.put("/:id/role", auth, role(["admin"]), updateUserRole);

export default router;
