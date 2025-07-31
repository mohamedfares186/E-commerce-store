import Category from "./categories.model.js";
import generateId from "../utils/generateId.js";

// User and Guest Access
const retrieveAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("-_id -__v");
    if (!categories)
      return res.status(404).json({ Error: "No Categories Found" });

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const retrieveOneCategories = async (req, res) => {
  try {
    const { slug } = req.params;

    const findCategory = await Category.findOne({ slug: slug }).select("-_id -__v");
    if (!findCategory)
      return res.status(404).json({ Error: "Category is not found" });

    return res.status(200).json(findCategory);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

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
    return res.status(201).json({ Message: `${title} Category has been created successfully`}); // Created
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
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
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  retrieveAllCategories,
  retrieveOneCategories,
  createCategory,
  deleteCategory,
};
