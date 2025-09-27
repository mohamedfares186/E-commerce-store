import Product from "../models/products.model.mjs";
import { logger } from "../../../middleware/logger.mjs";

// User and guest Access
const retrieveAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (!products || products.length === 0) {
      return res.status(404).json({ Error: "No products found" });
    }

    return res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    logger.error("Error retrieving all products: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const retrieveProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ Error: "Product category is required" });
    }

    const findProducts = await Product.find({ category: category }).sort({
      createdAt: -1,
    });
    if (!findProducts || findProducts.length === 0) {
      return res
        .status(404)
        .json({ Error: "Products not found for this category" });
    }

    return res.status(200).json({
      success: true,
      data: findProducts,
      count: findProducts.length,
    });
  } catch (error) {
    logger.error("Error retrieving products by category: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const retrieveProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const findProduct = await Product.findOne({ productId: productId });
    if (!findProduct) {
      return res.status(404).json({ Error: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    logger.error("Error retrieving a product by ID: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { retrieveAllProducts, retrieveProductsByCategory, retrieveProductById };
