import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Stores the user's ID
    cartItems: {
      type: Map, // Map of itemId -> quantity
      of: Number,
      default: {},
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
