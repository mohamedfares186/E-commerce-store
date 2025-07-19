const Product = require("./products.model");

const retrieveAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) return res.status(404).json({ Error: "No products Found" });

    res.status(200).json({ products });
  } catch (error) {
    res.sendStatus(500);
  }
};
const retrieveProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category)
      return res.status(400).json({ Error: "product category is required" });

    const findProducts = await Product.find({ category: category });
    if (!findProducts || findProducts.length === 0)
      return res.status(404).json({ Error: "Products not found" });

    res.status(200).json(findProducts);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};
const retrieveProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ Error: "Product is required" });

    const findProduct = await Product.findOne({ _id: id });
    if (!findProduct)
      return res.status(404).json({ Error: "Product not found" });

    res.status(200).json(findProduct);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      productCode,
      title,
      imagePath,
      description,
      price,
      category,
      available,
      stock,
      createdAt,
    } = req.body;
    if (
      !productCode ||
      !title ||
      !imagePath ||
      !description ||
      !price ||
      !category ||
      !available ||
      !stock
    )
      return res
        .status(400)
        .json({ Error: "Please Enter the correct Information" });

    const matchProduct = await Product.findOne({ productCode: productCode });
    if (matchProduct)
      return res.status(400).json({ Error: "Product already exists" });

    const newProduct = new Product({
      productCode: productCode,
      title: title,
      imagePath: imagePath,
      description: description,
      price: price,
      category: category,
      available: available,
      stock: stock,
      createdAt: createdAt,
    });

    newProduct.save();
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { productCode } = req.body;
    if (!productCode)
      return res.status(400).json({ Error: "Product Code is required" });

    const matchProduct = await Product.findOne({ productCode: productCode });
    if (!matchProduct)
      return res.status(404).json({ Error: "Product Not Found" });

    await Product.deleteOne({ productCode: productCode }).exec();
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

module.exports = {
  retrieveAllProducts,
  retrieveProductsByCategory,
  retrieveProductById,
  createProduct,
  deleteProduct,
};
