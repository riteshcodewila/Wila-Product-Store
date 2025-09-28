import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './modules/product.module.js'; // <-- apna model import karo

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());//allow us to accept JSON data in the req.body

// Test route
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Create Product
app.post("/api/products", async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    const newProduct = new Product({ name, price, image });
    await newProduct.save();

    res
      .status(201)
      .json({ success: true, data: newProduct, message: "Product created successfully" });
  } catch (error) {
    console.error("Error in creating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
