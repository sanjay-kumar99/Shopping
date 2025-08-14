import Cart from "../models/Cart.js";

// Add to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cartItem = await Cart.findOne({ userId: req.user.id, productId });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user.id,
        productId,
        quantity: quantity || 1
      });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user.id }).populate("productId");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const updatedItem = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item
export const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
