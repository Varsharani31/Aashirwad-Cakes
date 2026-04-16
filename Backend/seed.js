import 'dotenv/config';
import mongoose from "mongoose";
import foodmodel from "./models/FoodModel.js";

const sampleFoods = [
  {
    name: "Chocolate Truffle Cake",
    price: 450,
    image: "food_1.png", // Assuming image names match old frontend assets
    category: "Cake"
  },
  {
    name: "Red Velvet Cake",
    price: 550,
    image: "food_2.png",
    category: "Cake"
  },
  {
    name: "Black Forest Cake",
    price: 400,
    image: "food_3.png",
    category: "Cake"
  },
  {
    name: "Vanilla Fruit Cake",
    price: 350,
    image: "food_4.png",
    category: "Cake"
  }
];

const seedData = async () => {
  try {
    console.log("Connecting to Database:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected.");

    // Delete existing records to avoid duplicates if run multiple times
    await foodmodel.deleteMany({});
    console.log("Cleared existing food items.");

    // Insert new data
    await foodmodel.insertMany(sampleFoods);
    console.log("Demo Custom Cakes Added Successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
