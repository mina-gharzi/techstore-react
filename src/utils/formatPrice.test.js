import { describe, expect, it } from "vitest";
import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("formats numbers with Persian digits, separators and the currency", () => {
    expect(formatPrice(79_900_000)).toMatch(/^[۰-۹٬,]+ تومان$/);
    expect(formatPrice(0)).toBe("۰ تومان");
  });

  it("accepts numeric strings", () => {
    expect(formatPrice("1500")).toBe(formatPrice(1500));
  });

  it("falls back to zero for non-numeric input", () => {
    expect(formatPrice("abc")).toBe("۰ تومان");
    expect(formatPrice(undefined)).toBe("۰ تومان");
  });
});
