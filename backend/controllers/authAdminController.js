import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const decryptPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_KEY);
    const originalPass = decryptPass.toString(CryptoJS.enc.Utf8);

    if (originalPass !== req.body.password) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

export const logoutAdmin = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, "_id email name role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
