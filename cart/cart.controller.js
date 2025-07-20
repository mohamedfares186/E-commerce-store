const Cart = require("./cart.model");
const Product = require("../products/products.model");

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user", "username email")
      .populate("items.productId", "name price image");
    res.status(200).json({
      success: true,
      data: carts,
      count: carts.length,
    });
  } catch (error) {
    console.error("Get all carts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    const findUserCart = await Cart.findOne({ user: id })
      .populate("items.productId", "name price image description stock")
      .populate("user", "username email");

    if (!findUserCart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    res.status(200).json({
      success: true,
      data: findUserCart,
    });
  } catch (error) {
    console.error("Get cart by user ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Input validation
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (quantity > 100) {
      return res.status(400).json({
        message: "Quantity cannot exceed 100 items",
      });
    }

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const price = product.price;
    const total = price * quantity;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ productId, quantity, price, total }],
        totalQuantity: quantity,
        totalAmount: total,
      });
    } else {
      // Check if product already exists in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > 100) {
          return res.status(400).json({
            message: "Total quantity for this product cannot exceed 100 items",
          });
        }
        existingItem.quantity = newQuantity;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        cart.items.push({ productId, quantity, price, total });
      }

      // Recalculate totals
      cart.totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.total, 0);
    }

    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.status(201).json({
      success: true,
      message:
        cart.items.length === 1
          ? "Cart created successfully"
          : "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Cart creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("Delete cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 100) {
        return res.status(400).json({
          message: "Total quantity for this product cannot exceed 100 items",
        });
      }
      existingItem.quantity = newQuantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    }

    // Recalculate totals
    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.total, 0);

    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Add item to cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate totals
    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.total, 0);

    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Remove item from cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateItemInCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (quantity > 100) {
      return res.status(400).json({
        message: "Quantity cannot exceed 100 items",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    existingItem.quantity = quantity;
    existingItem.total = existingItem.quantity * existingItem.price;

    // Recalculate totals
    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.total, 0);

    await cart.save();
    await cart.populate("items.productId", "name price image stock");

    res.status(200).json({
      success: true,
      message: "Item quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Update item in cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCarts,
  getCartByUserId,
  createCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
  clearCart,
};
