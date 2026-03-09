import products from "../models/productModel.js";

// Get all products
const getAllProducts = (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products,
  });
};

// Get single product by ID
const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: `Product with id ${id} not found`,
    });
  }

  res.json({
    success: true,
    data: product,
  });
};

// Get products by category
const getProductsByCategory = (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({
      success: false,
      error: "Category parameter is required",
    });
  }

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );

  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts,
  });
};

// Get products in stock
const getInStockProducts = (req, res) => {
  const inStockProducts = products.filter((p) => p.inStock);

  res.json({
    success: true,
    count: inStockProducts.length,
    data: inStockProducts,
  });
};

export {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getInStockProducts,
};
