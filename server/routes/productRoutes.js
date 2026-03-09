import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getInStockProducts,
} from "../controllers/productController.js";

const router = express.Router();

// GET /api/products - Get all products
router.get("/", getAllProducts);

// GET /api/products/in-stock - Get products in stock
router.get("/in-stock", getInStockProducts);

// GET /api/products/category?category=Electronics - Get products by category
router.get("/category", getProductsByCategory);

// GET /api/products/:id - Get single product
router.get("/:id", getProductById);

export default router;
