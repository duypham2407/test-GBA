import Category from "../models/Category.js";
import Product from "../models/Product.js";

// CREATE
export const createCategory = async (req, res) => {
  let error = {};

  try {
    const category = new Category({
      name: req.body.name,
      desc: req.body.desc,
      slug: req.body.slug,
      img: req.body.img,
      isActive: req.body.isActive,
      parentId: req.body.parentId,
    });
    const saveCategory = await category.save();
    return res.status(201).json(saveCategory);
  } catch {
    error.other = "Tạo danh mục thất bại!"
    return res.status(500).json(error);
  }
};

// GET ALL
export const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  let root = {};

  if (categories && categories.length > 0) {
    const idMapping = categories.reduce((acc, el, i) => {
      acc[el._id] = i;
      return acc;
    }, {});

    categories.forEach(el => {
      // Handle the root element
      if (!el.parentId) {
        root = el._doc;
        return;
      }

      if (!el.isActive) {
        return;
      }

      // Use our mapping to locate the parent element in our data array
      const parentEl = categories[idMapping[el.parentId]]._doc;
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl.children || []), el];
    });
  }

  try {
    return res.status(201).json({ categories: categories, treeCategories: root });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  let error = {};

  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    return res.status(201).json(category);
  } catch {
    error.other = "Cập nhật danh mục thất bại!";
    return res.status(500).json(error);
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  let error = {};
  try {
    await Category.findByIdAndDelete(req.params.id);
    // delete child cateogries
    await Category.deleteMany({ parentId: req.params.id });
    // remove category on product
    await Product.updateMany(
      { categories: req.params.id },
      { $pull: { categories: { $eq: req.params.id } } }
    );
    return res.status(201).json(req.params.id);
  } catch {
    error.other = "Xoá danh mục thất bại!"
    return res.status(500).json(error);
  }
};

// CHECK SLUG
export const checkSlug = async (req, res) => {
  let error = {};
  const checkSlug = req.body._id ? await Category.find({ slug: req.body.slug, _id: { $ne: req.body._id } }) : await Category.find({ slug: req.body.slug });

  error.slug = "Đường dẫn đã tồn tại!";

  return checkSlug?.length ? res.status(500).json(error) : res.sendStatus(200);

}
