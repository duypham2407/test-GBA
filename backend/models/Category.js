import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String },
    img: { type: String },
    parentId: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
)
export default mongoose.model("Category", categorySchema);