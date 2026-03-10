import express from "express";
import { loginAdmin, logoutAdmin, getMe } from "../controllers/authAdminController.js";
import { verifyTokenAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

/*
 * FOR Admin 
 */
// Login
router.post("/login", loginAdmin);

// Logout
router.delete("/logout", logoutAdmin);

// Get current user
router.get("/me", verifyTokenAdmin, getMe);

export default router;