import { describe, expect, it } from "vitest";
import {
  formatMad,
  getCollectionLabel,
  getSizeLabelsByCategory,
  getStockStatus,
  normalizeCategory,
  slugifyProductName,
} from "../utils";

describe("products/utils", () => {
  describe("formatMad", () => {
    it("formats a number with MAD currency", () => {
      expect(formatMad(1200)).toBe("1\u202f200 MAD");
    });

    it("formats decimals correctly", () => {
      expect(formatMad(1250.5)).toBe("1\u202f250,5 MAD");
    });
  });

  describe("slugifyProductName", () => {
    it("converts a product name to a slug", () => {
      expect(slugifyProductName("Oversized Tee Casablanca")).toBe("oversized-tee-casablanca");
    });

    it("removes accents and special characters", () => {
      expect(slugifyProductName("T-shirt Noir & Blanc !")).toBe("t-shirt-noir-blanc");
    });
  });

  describe("getCollectionLabel", () => {
    it("returns Summer collection for shoes", () => {
      expect(getCollectionLabel({ category: "Chaussures" })).toBe("Collection Summer 24");
    });

    it("returns Essentials for clothing", () => {
      expect(getCollectionLabel({ category: "Vetements" })).toBe("Essentials Series");
    });

    it("returns Lifestyle for accessories", () => {
      expect(getCollectionLabel({ category: "Accessoires" })).toBe("Lifestyle Pack");
    });
  });

  describe("getStockStatus", () => {
    it("returns out of stock when stock is 0", () => {
      expect(getStockStatus(0)).toBe("Hors stock");
    });

    it("returns low stock when stock is 8 or less", () => {
      expect(getStockStatus(8)).toBe("Stock faible");
      expect(getStockStatus(3)).toBe("Stock faible");
    });

    it("returns active when stock is above 8", () => {
      expect(getStockStatus(9)).toBe("Actif");
    });
  });

  describe("getSizeLabelsByCategory", () => {
    it("returns shoe sizes for Chaussures", () => {
      expect(getSizeLabelsByCategory("Chaussures")).toContain("42");
    });

    it("returns clothing sizes for Vetements", () => {
      expect(getSizeLabelsByCategory("Vetements")).toContain("M");
    });

    it("returns unique size for Accessoires", () => {
      expect(getSizeLabelsByCategory("Accessoires")).toEqual(["Unique"]);
    });
  });

  describe("normalizeCategory", () => {
    it("returns the category as-is for known values", () => {
      expect(normalizeCategory("Chaussures")).toBe("Chaussures");
      expect(normalizeCategory("Accessoires")).toBe("Accessoires");
    });

    it("defaults to Vetements for unknown values", () => {
      expect(normalizeCategory("Hoodies")).toBe("Vetements");
    });
  });
});
