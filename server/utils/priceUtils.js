// Calculate price with discount
export const applyDiscount = (price, discountPercent) => {
  if (price < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error("Invalid price or discount percentage");
  }
  return price - (price * discountPercent) / 100;
};

// Calculate tax
export const calculateTax = (price, taxRate) => {
  if (price < 0 || taxRate < 0) {
    throw new Error("Invalid price or tax rate");
  }
  return price * (taxRate / 100);
};

// Calculate final price with tax
export const calculateFinalPrice = (price, taxRate) => {
  const tax = calculateTax(price, taxRate);
  return price + tax;
};

// Format price to currency
export const formatPrice = (price, currency = "USD") => {
  if (typeof price !== "number" || isNaN(price)) {
    throw new Error("Price must be a valid number");
  }
  return `${currency} ${price.toFixed(2)}`;
};
