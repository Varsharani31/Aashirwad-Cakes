import fs from "fs/promises";
import foodModel from "../models/foodModel.js";

// Add food
export const addFood = async (req, res) => {
  try {
    const image_filename = req.file.filename;

    const food = new foodModel({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// List all food
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error listing food:", error);
    res.json({ success: false, message: "Error listing food" });
  }
};

// Remove food
export const removefood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Try to delete image if it exists
    try {
      await fs.unlink(`uploads/${food.image}`);
    } catch (err) {
      console.warn(`Warning: Could not delete image ${food.image}. It might already be removed.`);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Error removing food:", error);
    res.json({ success: false, message: "Error removing food" });
  }
};
