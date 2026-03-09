import {
  capitalizeWords,
  generateSlug,
  truncate,
} from "../utils/stringUtils.js";

describe("String Utils", () => {
  describe("capitalizeWords", () => {
    test("should capitalize first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
    });

    test("should handle single word", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
    });

    test("should handle already capitalized words", () => {
      expect(capitalizeWords("HELLO WORLD")).toBe("Hello World");
    });

    test("should throw error for non-string input", () => {
      expect(() => capitalizeWords(123)).toThrow("Input must be a string");
    });
  });

  describe("generateSlug", () => {
    test("should generate slug from string", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
    });

    test("should remove special characters", () => {
      expect(generateSlug("Hello @World!")).toBe("hello-world");
    });

    test("should handle multiple spaces", () => {
      expect(generateSlug("Hello    World")).toBe("hello-world");
    });

    test("should trim dashes from ends", () => {
      expect(generateSlug("  Hello World  ")).toBe("hello-world");
    });

    test("should throw error for non-string input", () => {
      expect(() => generateSlug(123)).toThrow("Input must be a string");
    });
  });

  describe("truncate", () => {
    test("should truncate long string", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
    });

    test("should not truncate short string", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
    });

    test("should use custom suffix", () => {
      expect(truncate("Hello World", 8, ">>>")).toBe("Hello>>>");
    });

    test("should throw error for non-string input", () => {
      expect(() => truncate(123, 5)).toThrow("Input must be a string");
    });
  });
});
