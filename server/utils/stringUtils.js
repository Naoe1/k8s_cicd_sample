// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Generate slug from string
export const generateSlug = (str) => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Truncate string
export const truncate = (str, maxLength, suffix = "...") => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - suffix.length) + suffix;
};
