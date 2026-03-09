import {
  validateProduct,
  filterByPriceRange,
  searchByName,
  calculateInventoryValue,
} from "../utils/productUtils.js";

describe("Product Utils", () => {
  const mockProducts = [
    {
      id: 1,
      name: "Laptop",
      description: "Gaming laptop",
      price: 1200,
      category: "Electronics",
      inStock: true,
    },
    {
      id: 2,
      name: "Mouse",
      description: "Wireless mouse",
      price: 30,
      category: "Electronics",
      inStock: true,
    },
    {
      id: 3,
      name: "Keyboard",
      description: "Mechanical keyboard",
      price: 80,
      category: "Electronics",
      inStock: false,
    },
  ];

  describe("validateProduct", () => {
    test("should validate a valid product", () => {
      const product = { name: "Test Product", price: 100, category: "Test" };
      const result = validateProduct(product);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should reject product without name", () => {
      const product = { name: "", price: 100, category: "Test" };
      const result = validateProduct(product);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Product name is required and must be a non-empty string",
      );
    });

    test("should reject product with negative price", () => {
      const product = { name: "Test", price: -10, category: "Test" };
      const result = validateProduct(product);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Product price must be a non-negative number",
      );
    });

    test("should reject product without category", () => {
      const product = { name: "Test", price: 100 };
      const result = validateProduct(product);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Product category is required and must be a string",
      );
    });
  });

  describe("filterByPriceRange", () => {
    test("should filter products within price range", () => {
      const result = filterByPriceRange(mockProducts, 50, 1000);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Keyboard");
    });

    test("should return all products if all are in range", () => {
      const result = filterByPriceRange(mockProducts, 0, 2000);
      expect(result).toHaveLength(3);
    });

    test("should throw error for invalid price range", () => {
      expect(() => filterByPriceRange(mockProducts, 100, 50)).toThrow(
        "Invalid price range",
      );
    });
  });

  describe("searchByName", () => {
    test("should find products by name", () => {
      const result = searchByName(mockProducts, "laptop");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Laptop");
    });

    test("should find products by description", () => {
      const result = searchByName(mockProducts, "wireless");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Mouse");
    });

    test("should return all products for empty search", () => {
      const result = searchByName(mockProducts, "");
      expect(result).toHaveLength(3);
    });
  });

  describe("calculateInventoryValue", () => {
    test("should calculate total value of in-stock products", () => {
      const result = calculateInventoryValue(mockProducts);
      expect(result).toBe(1230); // Laptop (1200) + Mouse (30)
    });
  });
});
