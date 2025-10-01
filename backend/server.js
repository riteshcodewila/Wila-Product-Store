import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './modules/product.module.js'; // <-- apna model import karo
import mongoose from 'mongoose';

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
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  console.log("id", id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid product id " });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

    res.status(200).json({ success: true, data: updatedProduct });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })


  }
})
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error in deleting product:", error.message);
    res.status(404).json({ success: false, message: "Product Not Found With this id " });

  }
})
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in fetching product:", error.message);
    res.status(500).json({ success: false, message: "Server error" })

  }
})
app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
