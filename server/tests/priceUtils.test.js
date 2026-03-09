import {
  applyDiscount,
  calculateTax,
  calculateFinalPrice,
  formatPrice,
} from "../utils/priceUtils.js";

describe("Price Utils", () => {
  describe("applyDiscount", () => {
    test("should apply 10% discount correctly", () => {
      expect(applyDiscount(100, 10)).toBe(90);
    });

    test("should apply 50% discount correctly", () => {
      expect(applyDiscount(200, 50)).toBe(100);
    });

    test("should return original price with 0% discount", () => {
      expect(applyDiscount(100, 0)).toBe(100);
    });

    test("should throw error for negative price", () => {
      expect(() => applyDiscount(-100, 10)).toThrow(
        "Invalid price or discount percentage",
      );
    });

    test("should throw error for discount over 100%", () => {
      expect(() => applyDiscount(100, 101)).toThrow(
        "Invalid price or discount percentage",
      );
    });
  });

  describe("calculateTax", () => {
    test("should calculate 10% tax correctly", () => {
      expect(calculateTax(100, 10)).toBe(10);
    });

    test("should calculate 8.5% tax correctly", () => {
      expect(calculateTax(100, 8.5)).toBe(8.5);
    });

    test("should throw error for negative price", () => {
      expect(() => calculateTax(-100, 10)).toThrow("Invalid price or tax rate");
    });
  });

  describe("calculateFinalPrice", () => {
    test("should calculate final price with tax", () => {
      expect(calculateFinalPrice(100, 10)).toBe(110);
    });
  });

  describe("formatPrice", () => {
    test("should format price with default USD currency", () => {
      expect(formatPrice(99.99)).toBe("USD 99.99");
    });

    test("should format price with custom currency", () => {
      expect(formatPrice(50, "EUR")).toBe("EUR 50.00");
    });

    test("should throw error for non-number input", () => {
      expect(() => formatPrice("invalid")).toThrow(
        "Price must be a valid number",
      );
    });
  });
});
