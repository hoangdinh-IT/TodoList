import Category from "../models/category.model.js";
import Task from "../models/task.model.js";

const createCategory = async (req, res) => {
    try {
        const { title } = req.body;

        const count = await Category.countDocuments({ userId: req.user._id });

        const category = await Category.create({
            title,
            userId: req.user._id,
            order: count,
        });

        return res.status(201).json(category);
    } catch (err) {
        console.error("Error in createCategory: ", err);
        res.status(500).json({ message: "Lỗi khi xoá danh mục!" });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user._id }).sort({ order: 1 });
        return res.json(categories);
    } catch (err) {
        console.error("Error in getCategories: ", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục!" });
    }
}


const getCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findOne({ 
            _id: categoryId, 
            userId: req.user._id 
        });

        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại!" });
        }

        return res.json(category);
    } catch (err) {
        console.error("Error in getCategory: ", err);
        res.status(500).json({ message: "Lỗi khi lấy danh mục!" });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { title } = req.body;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại!" });
        }

        if (category.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        category.title = title;

        const updated = await category.save();
        return res.json(updated);
    } catch (err) {
        console.error("Error in updateCategory: ", err);
        res.status(500).json({ message: "Lỗi khi cập nhật danh mục!" });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại!" });
        }

        if (category.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await Task.deleteMany({ categoryId });
        await Category.deleteOne({ _id: categoryId });
        
        return res.json({ message: "Danh mục được xoá thành công!" });
    } catch (err) {
        console.error("Error in deleteCategory: ", err);
        res.status(500).json({ message: "Lỗi khi xoá danh mục!" });
    }
}

const updateCategoryOrder = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    await Category.bulkWrite(
      categories.map((item) => ({
        updateOne: {
          filter: { _id: item.id, userId: req.user._id },
          update: { $set: { order: item.order } },
        },
      }))
    );

    res.json({ message: "Cập nhật thứ tự danh mục thành công!" });
  } catch (err) {
    console.err("Lỗi update-order:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật thứ tự danh mục" });
  }
};

export {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    updateCategoryOrder,
}