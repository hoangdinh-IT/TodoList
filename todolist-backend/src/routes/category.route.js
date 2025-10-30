import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory, updateCategoryOrder } from "../controllers/category.controller.js";

const router = express.Router();

router.put("/update-order", protect, updateCategoryOrder);

router.post("/", protect, createCategory);
router.get("/", protect, getCategories);
router.get("/:categoryId", protect, getCategory);
router.put("/:categoryId", protect, updateCategory);
router.delete("/:categoryId", protect, deleteCategory);

export default router;