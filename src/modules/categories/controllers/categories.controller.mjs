import Category from "../models/categories.model.mjs";
import { logger } from "../../../middleware/logger.mjs";

// User and Guest Access
const retrieveAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("-_id -__v");
    if (!categories)
      return res.status(404).json({ Error: "No Categories Found" });

    return res.status(200).json(categories);
  } catch (error) {
    logger.error("Error retrieving all categories: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const retrieveOneCategories = async (req, res) => {
  try {
    const { slug } = req.params;

    const findCategory = await Category.findOne({ slug: slug }).select(
      "-_id -__v"
    );
    if (!findCategory)
      return res.status(404).json({ Error: "Category is not found" });

    return res.status(200).json(findCategory);
  } catch (error) {
    logger.error("Error retrieving one category: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { retrieveAllCategories, retrieveOneCategories };
