import fs from "fs/promises";
import foodModel from "../models/foodModel.js";

import mongoose from "mongoose";

let inMemoryFoods = []; // Fallback memory store when DB is disconnected

// Add food
export const addFood = async (req, res) => {
  try {
    const image_filename = req.file.filename;

    const foodData = {
      name: req.body.name,
      price_half_kg: req.body.price_half_kg,
      price_one_kg: req.body.price_one_kg,
      category: req.body.category,
      image: image_filename,
    };

    if (mongoose.connection.readyState === 1) { // 1 = connected
      const food = new foodModel(foodData);
      await food.save();
    } else {
      foodData._id = Date.now().toString(); // Generate fallback fake ID
      inMemoryFoods.push(foodData);
    }

    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// List all food
export const listFood = async (req, res) => {
  try {
    let foods = [];
    if (mongoose.connection.readyState === 1) {
      foods = await foodModel.find({});
    }
    // Combine with in-memory foods
    foods = [...foods, ...inMemoryFoods];
    
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error listing food:", error);
    res.json({ success: false, message: "Error listing food" });
  }
};

// Remove food
export const removefood = async (req, res) => {
  try {
    const id = req.body.id;
    let imageToDelete = null;
    let foodFound = false;

    if (mongoose.connection.readyState === 1) {
      const food = await foodModel.findById(id);
      if (food) {
        imageToDelete = food.image;
        await foodModel.findByIdAndDelete(id);
        foodFound = true;
      }
    }

    // Check in-memory fallback array
    const memoryIndex = inMemoryFoods.findIndex(f => f._id === id);
    if (memoryIndex !== -1) {
      imageToDelete = inMemoryFoods[memoryIndex].image;
      inMemoryFoods.splice(memoryIndex, 1);
      foodFound = true;
    }

    if (!foodFound) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (imageToDelete) {
      try {
        await fs.unlink(`uploads/${imageToDelete}`);
      } catch (err) {
        console.warn(`Warning: Could not delete image ${imageToDelete}. It might already be removed.`);
      }
    }

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Error removing food:", error);
    res.json({ success: false, message: "Error removing food" });
  }
};
