import Product from "../modules/product.module.js";
import mongoose from "mongoose";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in fetching product:", error.message);
    res.status(500).json({ success: false, message: "Server error" })

  }
}

export const createProducts = async (req, res) => {
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
}

export const deleteProduct =async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error in deleting product:", error.message);
    res.status(404).json({ success: false, message: "Product Not Found With this id " });

  }
}


export const updateProduct =  async (req, res) => {
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
}