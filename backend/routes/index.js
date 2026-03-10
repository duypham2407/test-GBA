import express from "express";
import authAdminRouter from "./authAdmin.route.js";
import productRouter from "./product.route.js";
import categoryRouter from "./category.route.js";

const router = express.Router();

// Currently keeping category router as an optional feature, but main ones are auth and products
router.use("/auth", authAdminRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);

export default router;