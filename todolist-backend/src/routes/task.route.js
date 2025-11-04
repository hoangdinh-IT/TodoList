import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createTask, getTasks, getTask, updateTask, deleteTask, updateCompletedTask } from "../controllers/task.controller.js";

const router = express.Router();

router.put("/update-completed/:taskId", protect, updateCompletedTask);
// router.get("/categoryId", protect, getTasksByCategory);

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:taskId", protect, getTask);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

export default router;