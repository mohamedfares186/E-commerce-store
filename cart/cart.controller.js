import Cart from "./cart.model.js";
import Product from "../products/products.model.js";
import generateId from "../utils/generateId.js";


// Admin Access
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user", "username email")
      .populate("items.productId", "title price imagePath")
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: carts,
      count: carts.length,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const getCartByUserIdAdmin = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ Error: "User ID is required" });

    const findUserCart = await Cart.findOne({ user: userId })
      .populate("items.productId", "title price imagePath description stock")
      .populate("user", "username email");

    if (!findUserCart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    return res.status(200).json({
      success: true,
      data: findUserCart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}


// User Access
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(403).json({ Error: "Access Denied" });

    const findUserCart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.productId",
        select: "title price imagePath stock",
        model: "Product",
        foreignField: "productId"
      })
      .populate({
        path: "user",
        select: "username email", // Fields from the User model
        model: "User",
        foreignField: "userId" // <--- Tell populate to match against this field in the User model
    });

    if (!findUserCart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    return res.status(200).json({
      success: true,
      data: findUserCart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const createCart = async (req, res) => {
  try {
    const { userId } = req.user;

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
    const product = await Product.findOne({ productId: productId });
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

    const cartId = generateId();

    if (!cart) {
      cart = new Cart({
        cartId: cartId,
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
    await cart.populate({
      path: "items.productId",
      select: "title price imagePath stock",
      model: "Product",
      foreignField: "productId"
    });

    return res.status(201).json({
      success: true,
      message:
        cart.items.length === 1
          ? "Cart created successfully"
          : "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const deleteCart = async (req, res) => {
  try {
    const { userId } = req.user;

    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.user;
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

    const product = await Product.findOne({ productId: productId });
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
    await cart.populate({
      path: "items.productId",
      select: "title price imagePath stock",
      model: "Product",
      foreignField: "productId"
    });

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

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
    await cart.populate("items.productId", "title price imagePath stock");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const updateItemInCart = async (req, res) => {
  try {
    const { userId } = req.user;
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

    const product = await Product.findOne({ productId: productId });
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
    await cart.populate({
      path: "items.productId",
      select: "title price imagePath stock",
      model: "Product",
      foreignField: "productId"
    });

    return res.status(200).json({
      success: true,
      message: "Item quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.user;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalAmount = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export {
  getAllCarts,
  getCartByUserIdAdmin,
  getCartByUserId,
  createCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
  clearCart,
};
