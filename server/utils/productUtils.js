/**
 * Filter products by category (case-insensitive).
 * @param {Array} products
 * @param {string} category
 * @returns {Array}
 */
export const filterByCategory = (products, category) => {
  if (!category || typeof category !== "string") return [];
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
};

/**
 * Filter products that are currently in stock.
 * @param {Array} products
 * @returns {Array}
 */
export const filterInStock = (products) => {
  return products.filter((p) => p.inStock === true);
};

/**
 * Find a single product by its numeric ID.
 * @param {Array} products
 * @param {number} id
 * @returns {object|undefined}
 */
export const findById = (products, id) => {
  return products.find((p) => p.id === id);
};

/**
 * Sort products by price.
 * @param {Array} products
 * @param {"asc"|"desc"} order
 * @returns {Array}
 */
export const sortByPrice = (products, order = "asc") => {
  const sorted = [...products];
  sorted.sort((a, b) =>
    order === "desc" ? b.price - a.price : a.price - b.price,
  );
  return sorted;
};

/**
 * Return the min and max price from a list of products.
 * @param {Array} products
 * @returns {{ min: number, max: number } | null}
 */
export const getPriceRange = (products) => {
  if (!products.length) return null;
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};
