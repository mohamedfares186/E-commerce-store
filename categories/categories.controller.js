const Category = require("./categories.model");

const retrieveAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

const retrieveOneCategories = async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(400).json({ Error: "Please select a category" });

  const findCategory = await Category.findOne({ slug: slug }).select("title");
  if (!findCategory)
    return res.status(404).json({ Error: "Category is not found" });

  res.status(200).json(findCategory);
};
const createCategory = async (req, res) => {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({ Error: "Category title is required" });

  const matchCategory = await Category.findOne({ title: title });
  if (matchCategory)
    return res.status(400).json({ Error: "Category already exists" });

  const addedCategory = new Category({
    title: title,
  });

  await addedCategory.save();
  res.sendStatus(201); // Created
};
const deleteCategory = async (req, res) => {};

module.exports = {
  retrieveAllCategories,
  retrieveOneCategories,
  createCategory,
  deleteCategory,
};
