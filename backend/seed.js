import mongoose from "mongoose";
import "dotenv/config";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

const mongoURL = process.env.MONGO_URL;

const seedProducts = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB for seeding");

    let category = await Category.findOne();
    
    if (!category) {
      console.log("No category found. Creating a demo category...");
      category = new Category({
        name: "Clothing & Apparel",
        slug: "clothing-apparel-" + Date.now(),
        desc: "All kinds of clothing",
        isActive: true,
      });
      await category.save();
    }

    const demoProducts = [];
    const types = ["T-Shirt", "Hoodie", "Mug", "Poster", "Cap", "Phone Case", "Tote Bag", "Sticker", "Notebook", "Pillow"];
    const adjectives = ["Awesome", "Cool", "Premium", "Vintage", "Modern", "Classic", "Limited", "Essential", "Cozy", "Graphic"];
    
    for (let i = 1; i <= 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const name = `${adj} ${type} ${i}`;
      
      demoProducts.push({
        name,
        description: `This is a high quality ${name}. Perfect for everyday use.`,
        price: Number((Math.random() * 50 + 10).toFixed(2)), // Random price between 10 and 60
        stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10 and 110
        status: Math.random() > 0.1 ? "active" : "out_of_stock", // mostly active
        category: category._id,
        image: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/400`
      });
    }

    await Product.insertMany(demoProducts);
    console.log("20 demo products inserted successfully!");

  } catch (err) {
    console.error("Error seeding products:", err);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedProducts();
