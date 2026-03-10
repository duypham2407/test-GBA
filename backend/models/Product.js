import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 0, min: 0 },
    status: { 
      type: String, 
      enum: ["active", "inactive", "out_of_stock"],
      default: "active"
    },
    image: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model("Product", productSchema);