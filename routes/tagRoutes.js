import express from "express";
import tagController from "../controllers/tagcontroller.js";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", tagController.getTags);
router.post("/", auth, role(["admin"]), tagController.createTag);
router.put("/:id", auth, role(["admin"]), tagController.updateTag);
router.delete("/:id", auth, role(["admin"]), tagController.deleteTag);

export default router;
