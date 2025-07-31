import Product from "./products.model.js";
import generateId from "../utils/generateId.js";


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
      count: products.length
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const retrieveProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ Error: "Product category is required" });
    }

    const findProducts = await Product.find({ category: category }).sort({ createdAt: -1 });
    if (!findProducts || findProducts.length === 0) {
      return res.status(404).json({ Error: "Products not found for this category" });
    }

    return res.status(200).json({
      success: true,
      data: findProducts,
      count: findProducts.length
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
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
      data: findProduct
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};


// Admin Access
const createProduct = async (req, res) => {
  try {
    const {
      title,
      imagePath,
      description,
      price,
      category,
      available,
      stock,
    } = req.body;
    
    if (
      !title ||
      !imagePath ||
      !description ||
      !price ||
      !category ||
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

    const newProduct = new Product({
      productId: productId,
      title: title,
      imagePath: imagePath,
      description: description,
      price: price,
      category: category,
      available: available,
      stock: stock,
    });

    await newProduct.save();
    
    return res.status(201).json({
      success: true,
      message: "Product has been created successfully",
      data: newProduct
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
      message: "Product has been deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      title,
      imagePath,
      description,
      price,
      category,
      available,
      stock,
    } = req.body;

    if (!productId) {
      return res.status(400).json({ Error: "Product ID is required" });
    }

    const findProduct = await Product.findOne({ productId: productId });
    if (!findProduct) {
      return res.status(404).json({ Error: "Product not found" });
    }

    // Update only provided fields
    if (title !== undefined) findProduct.title = title;
    if (imagePath !== undefined) findProduct.imagePath = imagePath;
    if (description !== undefined) findProduct.description = description;
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({ Error: "Price must be greater than 0" });
      }
      findProduct.price = price;
    }
    if (category !== undefined) findProduct.category = category;
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
      data: findProduct
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
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

    // Get products by category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    // Get recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        lowStockProducts,
        recentProducts,
        categoryStats
      }
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  retrieveAllProducts,
  retrieveProductsByCategory,
  retrieveProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductStats,
};
