// Validate product data
export const validateProduct = (product) => {
  const errors = [];

  if (
    !product.name ||
    typeof product.name !== "string" ||
    product.name.trim() === ""
  ) {
    errors.push("Product name is required and must be a non-empty string");
  }

  if (typeof product.price !== "number" || product.price < 0) {
    errors.push("Product price must be a non-negative number");
  }

  if (!product.category || typeof product.category !== "string") {
    errors.push("Product category is required and must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Filter products by price range
export const filterByPriceRange = (products, minPrice, maxPrice) => {
  if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
    throw new Error("Invalid price range");
  }
  return products.filter((p) => p.price >= minPrice && p.price <= maxPrice);
};

// Search products by name
export const searchByName = (products, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== "string") {
    return products;
  }
  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerSearchTerm) ||
      p.description?.toLowerCase().includes(lowerSearchTerm),
  );
};

// Calculate total inventory value
export const calculateInventoryValue = (products) => {
  return products.reduce((total, product) => {
    if (product.inStock) {
      return total + product.price;
    }
    return total;
  }, 0);
};
