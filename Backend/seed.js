import 'dotenv/config';
import mongoose from "mongoose";
import foodmodel from "./models/foodModel.js";

const sampleFoods = [
    { name: "Pineapple", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_1.png" },
    { name: "Strawberry", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_2.png" },
    { name: "Black Currant", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_3.png" },
    { name: "Black Forest", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "Blackforest.png" },
    { name: "White Forest", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_4.png" },
    { name: "Pan Flavour", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_5.png" },
    { name: "Mango", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_6.png" },
    { name: "Chocolate", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_7.png" },
    { name: "Chocolate Truffle", price_half_kg: 350, price_one_kg: 650, category: "Birthday Cake", image: "food_8.png" },
    { name: "Chocolate Dutch", price_half_kg: 320, price_one_kg: 620, category: "Birthday Cake", image: "food_9.png" },
    { name: "Red Velvet", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_10.png" },
    { name: "Butterschotch", price_half_kg: 320, price_one_kg: 620, category: "Birthday Cake", image: "food_11.png" },
    { name: "Rasmalai", price_half_kg: 400, price_one_kg: 800, category: "Birthday Cake", image: "food_12.png" },
    { name: "Kesar Kulfi", price_half_kg: 300, price_one_kg: 600, category: "Birthday Cake", image: "food_13.png" },
    { name: "Oreo", price_half_kg: 340, price_one_kg: 640, category: "Birthday Cake", image: "food_14.png" },
    { name: "Doll Cake", price_half_kg: 400, price_one_kg: 800, category: "Theme Cake", image: "food_1.png" },
    { name: "Customized Cake", price_half_kg: 500, price_one_kg: 1000, category: "Theme Cake", image: "food_2.png" }
];

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://Aashirwad_Cakes:Aashirwad_Cakes@ac-r2iskan-shard-00-00.hana340.mongodb.net:27017,ac-r2iskan-shard-00-01.hana340.mongodb.net:27017,ac-r2iskan-shard-00-02.hana340.mongodb.net:27017/Cake?ssl=true&replicaSet=atlas-e43to3-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(uri);
    await foodmodel.deleteMany({});
    await foodmodel.insertMany(sampleFoods);
    console.log("Successfully seeded all 17 cakes into Atlas DB!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
