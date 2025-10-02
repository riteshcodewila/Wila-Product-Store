import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createProduct = async (req, res) => {
	const product = req.body;

	if (!product.name || !product.price || !product.image) {
		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/create?error=Please+provide+all+fields");
		}
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newProduct = new Product(product);

	try {
		await newProduct.save();

		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/"); // redirect to home page
		}

		res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		console.error("Error in Create product:", error.message);
		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/create?error=Server+Error");
		}
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const product = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect(`/?error=Invalid+Product+Id`);
		}
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/"); // redirect after update
		}

		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		console.error("Error in Update product:", error.message);
		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/?error=Server+Error");
		}
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/?error=Invalid+Product+Id");
		}
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		await Product.findByIdAndDelete(id);

		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/"); // redirect after deletion
		}

		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		console.log("error in deleting product:", error.message);
		if (req.headers.accept && req.headers.accept.includes("text/html")) {
			return res.redirect("/?error=Server+Error");
		}
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
