import mongoose from "mongoose";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log("DB connection error:", err);
    process.exit(1);
  });

const importData = async () => {
  try {
    await User.collection.drop().catch(() => {});
    await Category.collection.drop().catch(() => {});
    await Product.collection.drop().catch(() => {});

    const encryptedPassword = CryptoJS.AES.encrypt("Admin@123", process.env.PASS_KEY).toString();

    await User.create({
      email: "admin@gmail.com",
      password: encryptedPassword,
      name: "Admin User",
      role: "admin",
    });

    const categories = await Category.insertMany([
      { name: "T-Shirt", slug: "t-shirt", isActive: true },
      { name: "Hoodie", slug: "hoodie", isActive: true },
      { name: "Mug", slug: "mug", isActive: true },
    ]);

    await Product.insertMany([
      {
        name: "Classic White T-Shirt",
        description: "A very comfortable white t-shirt for all sizes.",
        price: 15.99,
        category: categories[0]._id,
        stock: 100,
        status: "active",
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Black Design Hoodie",
        description: "Warm hoodie with a cool design.",
        price: 35.50,
        category: categories[1]._id,
        stock: 50,
        status: "active",
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Coffee Lover Mug",
        description: "Ceramic mug 11oz.",
        price: 9.99,
        category: categories[2]._id,
        stock: 0,
        status: "out_of_stock",
        image: "https://via.placeholder.com/150",
      }
    ]);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
