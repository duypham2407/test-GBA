import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken.js";
import { createCategory, getAllCategories, updateCategory, deleteCategory, checkSlug } from "../controllers/categoryController.js";

const router = express.Router();

// CREATE
router.post("/", verifyTokenAdmin, createCategory);

// GET ALL
router.get("/", verifyTokenAdmin, getAllCategories);

// UPDATE
router.put("/:id", verifyTokenAdmin, updateCategory);

// DELETE
router.delete("/:id", verifyTokenAdmin, deleteCategory);

// CHECK SLUG 
router.post("/check", verifyTokenAdmin, checkSlug);

// CLIENT
// GET ALL
router.get("/client", getAllCategories);

export default router;