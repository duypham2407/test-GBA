import express from "express";
import { loginAdmin, logoutAdmin } from "../controllers/authAdminController.js";

const router = express.Router();

/*
 * FOR Admin 
 */
// Login
router.post("/login", loginAdmin);

// Logout
router.delete("/logout", logoutAdmin);

export default router;