import Category from "../models/categories.model.mjs";
import generateId from "../../../utils/generateId.mjs";
import { logger } from "../../../middleware/logger.mjs";

// Admin Access
const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ Error: "Category title is required" });

    const findCategory = await Category.findOne({ title: title });
    if (findCategory)
      return res.status(400).json({ Error: "Category already exists" });

    const categoryId = generateId();

    const addedCategory = new Category({
      categoryId: categoryId,
      title: title,
    });

    await addedCategory.save();
    return res
      .status(201)
      .json({ Message: `${title} Category has been created successfully` }); // Created
  } catch (error) {
    logger.error("Error creating a category: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ Error: "Category title is required" });

    const findCategory = await Category.findOne({ title: title });
    if (!findCategory)
      return res.status(404).json({ Error: "Category is not found" });

    await Category.deleteOne({ title: title }).exec();
    return res.sendStatus(204);
  } catch (error) {
    logger.error("Error deleting a category: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createCategory, deleteCategory };
