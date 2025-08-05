import Product from "./products.model.js";
import Category from "../categories/categories.model.js";
import generateId from "../utils/generateId.js";
import sanitize from "../utils/sanitize.js";

// Admin Access
const createProduct = async (req, res) => {
  try {
    const { title, imagePath, description, price, category, available, stock } =
      req.body;

    // Sanitize text fields that could contain HTML
    const sanitizedTitle = sanitize(title);
    const sanitizedDescription = sanitize(description);
    const sanitizedCategory = sanitize(category);
    const sanitizedImagePath = sanitize(imagePath);

    if (
      !sanitizedTitle ||
      !sanitizedImagePath ||
      !sanitizedDescription ||
      !price ||
      !sanitizedCategory ||
      available === undefined ||
      !stock
    ) {
      return res
        .status(400)
        .json({ Error: "Please enter all required information" });
    }

    if (price <= 0) {
      return res.status(400).json({ Error: "Price must be greater than 0" });
    }

    if (stock < 0) {
      return res.status(400).json({ Error: "Stock cannot be negative" });
    }

    const productId = generateId();

    const findProduct = await Product.findOne({ productId: productId });
    if (findProduct) {
      return res.status(400).json({ Error: "Product ID already exists" });
    }

    const findCategory = await Category.findOne({
      title: { $regex: `^${sanitizedCategory}$`, $options: "i" },
    });
    if (!findCategory)
      return res.status(404).json({ Error: "Category not found" });

    const newProduct = new Product({
      productId: productId,
      title: sanitizedTitle,
      imagePath: sanitizedImagePath,
      description: sanitizedDescription,
      price: price,
      category: sanitizedCategory,
      available: available,
      stock: stock,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product has been created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ Error: "Product ID is required" });
    }

    const findProduct = await Product.findOne({ productId: productId });
    if (!findProduct) {
      return res.status(404).json({ Error: "Product not found" });
    }

    await Product.deleteOne({ productId: productId }).exec();

    return res.status(200).json({
      success: true,
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, imagePath, description, price, category, available, stock } =
      req.body;

    if (!productId)
      return res.status(400).json({ Error: "Product ID is required" });

    // Sanitize text fields that could contain HTML
    const sanitizedTitle = sanitize(title);
    const sanitizedDescription = sanitize(description);
    const sanitizedCategory = sanitize(category);
    const sanitizedImagePath = sanitize(imagePath);

    const findProduct = await Product.findOne({ productId: productId });
    if (!findProduct)
      return res.status(404).json({ Error: "Product not found" });

    const findCategory = await Category.findOne({
      title: { $regex: `^${sanitizedCategory}$`, $options: "i" },
    });
    if (!findCategory)
      return res.status(404).json({ Error: "Category not found" });

    // Update only provided fields with sanitization
    if (title !== undefined) findProduct.title = sanitizedTitle;
    if (imagePath !== undefined) findProduct.imagePath = sanitizedImagePath;
    if (description !== undefined)
      findProduct.description = sanitizedDescription;
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({ Error: "Price must be greater than 0" });
      }
      findProduct.price = price;
    }
    if (category !== undefined) findProduct.category = sanitizedCategory;
    if (available !== undefined) findProduct.available = available;
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({ Error: "Stock cannot be negative" });
      }
      findProduct.stock = stock;
    }

    await findProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: findProduct,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ available: true });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const lowStockProducts = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
    });

    // Get products by category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    // Get recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        lowStockProducts,
        recentProducts,
        categoryStats,
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export { createProduct, deleteProduct, updateProduct, getProductStats };
