const Category = require("./categories.model");

const retrieveAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories)
      return res.status(404).json({ Error: "No Categories Found" });
    res.status(200).json(categories);
  } catch (error) {
    res.sendStatus(500);
  }
};

const retrieveOneCategories = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug)
      return res.status(400).json({ Error: "Please select a category" });

    const findCategory = await Category.findOne({ slug: slug }).select("title");
    if (!findCategory)
      return res.status(404).json({ Error: "Category is not found" });

    res.status(200).json(findCategory);
  } catch (error) {
    res.sendStatus(500);
  }
};
const createCategory = async (req, res) => {
  try {
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
  } catch (error) {
    res.sendStatus(500);
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
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  retrieveAllCategories,
  retrieveOneCategories,
  createCategory,
  deleteCategory,
};
