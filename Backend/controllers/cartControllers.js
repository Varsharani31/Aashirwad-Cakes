import Cart from "../models/CartModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const { itemId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({
                userId,
                cartItems: { [itemId]: 1 }
            });
        } else {
            // Increment item quantity
            cart.cartItems.set(itemId, (cart.cartItems.get(itemId) || 0) + 1);
        }

        await cart.save();
        res.status(200).json({ cartData: cart.cartItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.cartItems.has(itemId)) {
            return res.status(400).json({ message: "Item not in cart" });
        }

        const newCount = cart.cartItems.get(itemId) - 1;
        if (newCount <= 0) {
            cart.cartItems.delete(itemId);
        } else {
            cart.cartItems.set(itemId, newCount);
        }

        await cart.save();
        res.status(200).json({ cartData: cart.cartItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get cart data
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, cartItems: {} });
            await cart.save();
        }

        res.status(200).json({ cartData: cart.cartItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
