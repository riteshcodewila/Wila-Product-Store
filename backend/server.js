import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

app.use(express.json());
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    // Catch-all route for React SPA - Fixed version
   // Replace the catch-all route with this:
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
}
// if (process.env.NODE_ENV === "production") {
//     const frontendPath = path.join(__dirname, "../frontend/dist");
//     app.use(express.static(frontendPath));

//     // Catch-all route for React SPA
//     app.get(/^(?!\/api).*/, (req, res) => {
//         res.sendFile(path.join(frontendPath, "index.html"));
//     });
// }

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});