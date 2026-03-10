import express from "express";
import { verifyTokenAdmin } from "../middleware/verifyToken.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getDashboardStats
} from "../controllers/productController.js";

const router = express.Router();

router.get("/stats", verifyTokenAdmin, getDashboardStats);
router.post("/", verifyTokenAdmin, createProduct);
router.get("/", verifyTokenAdmin, getProducts);
router.get("/:id", verifyTokenAdmin, getProductById);
router.put("/:id", verifyTokenAdmin, updateProduct);
router.delete("/:id", verifyTokenAdmin, deleteProduct);

export default router;