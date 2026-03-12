import {
  filterByCategory,
  filterInStock,
  findById,
  sortByPrice,
  getPriceRange,
} from "../utils/productUtils.js";

const sampleProducts = [
  {
    id: 1,
    name: "Laptop",
    price: 1299.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 29.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 89.99,
    category: "Electronics",
    inStock: false,
  },
  {
    id: 4,
    name: "USB-C Hub",
    price: 49.99,
    category: "Accessories",
    inStock: true,
  },
  {
    id: 5,
    name: "Monitor",
    price: 399.99,
    category: "Electronics",
    inStock: true,
  },
];

// ─── filterByCategory ────────────────────────────────────────────────────────

describe("filterByCategory", () => {
  test("returns products matching the given category (exact case)", () => {
    const result = filterByCategory(sampleProducts, "Electronics");
    expect(result).toHaveLength(4);
    result.forEach((p) => expect(p.category).toBe("Electronics"));
  });

  test("is case-insensitive", () => {
    const result = filterByCategory(sampleProducts, "electronics");
    expect(result).toHaveLength(2);
  });

  test("returns empty array when no products match", () => {
    expect(filterByCategory(sampleProducts, "Furniture")).toEqual([]);
  });

  test("returns empty array for falsy category", () => {
    expect(filterByCategory(sampleProducts, "")).toEqual([]);
    expect(filterByCategory(sampleProducts, null)).toEqual([]);
  });
});

// ─── filterInStock ───────────────────────────────────────────────────────────

describe("filterInStock", () => {
  test("returns only in-stock products", () => {
    const result = filterInStock(sampleProducts);
    expect(result).toHaveLength(4);
    result.forEach((p) => expect(p.inStock).toBe(true));
  });

  test("returns empty array when no products are in stock", () => {
    const outOfStock = sampleProducts.map((p) => ({ ...p, inStock: false }));
    expect(filterInStock(outOfStock)).toEqual([]);
  });

  test("returns empty array for empty input", () => {
    expect(filterInStock([])).toEqual([]);
  });
});

// ─── findById ────────────────────────────────────────────────────────────────

describe("findById", () => {
  test("returns the correct product for a valid id", () => {
    const result = findById(sampleProducts, 3);
    expect(result).toBeDefined();
    expect(result.name).toBe("Mechanical Keyboard");
  });

  test("returns undefined for a non-existent id", () => {
    expect(findById(sampleProducts, 99)).toBeUndefined();
  });
});

// ─── sortByPrice ─────────────────────────────────────────────────────────────

describe("sortByPrice", () => {
  test("sorts ascending by default", () => {
    const result = sortByPrice(sampleProducts);
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sorts descending when order is 'desc'", () => {
    const result = sortByPrice(sampleProducts, "desc");
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("does not mutate the original array", () => {
    const original = sampleProducts.map((p) => p.price);
    sortByPrice(sampleProducts, "asc");
    expect(sampleProducts.map((p) => p.price)).toEqual(original);
  });
});

// ─── getPriceRange ───────────────────────────────────────────────────────────

describe("getPriceRange", () => {
  test("returns correct min and max", () => {
    const range = getPriceRange(sampleProducts);
    expect(range).toEqual({ min: 29.99, max: 1299.99 });
  });

  test("returns same value for min and max when there is one product", () => {
    const range = getPriceRange([sampleProducts[0]]);
    expect(range).toEqual({ min: 1299.99, max: 1299.99 });
  });

  test("returns null for empty array", () => {
    expect(getPriceRange([])).toBeNull();
  });
});
