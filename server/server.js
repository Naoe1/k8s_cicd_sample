import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = ["http://localhost:8100", "http://localhost:4200"];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for local client apps
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Vary", "Origin");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Product API",
    version: "1.0.3",
    endpoints: {
      getAllProducts: "GET /api/products",
      getProductById: "GET /api/products/:id",
      getByCategory: "GET /api/products/category?category=<name>",
      getInStock: "GET /api/products/in-stock",
    },
  });
});

app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
