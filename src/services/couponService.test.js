import { describe, expect, it } from "vitest";
import { applyCoupon, calculateDiscount } from "./couponService";

describe("applyCoupon", () => {
  it("accepts known codes regardless of case and spaces", () => {
    expect(applyCoupon("  welcome10 ")).toMatchObject({ success: true, coupon: { code: "WELCOME10" } });
    expect(applyCoupon("TECH50").success).toBe(true);
  });

  it("rejects empty and unknown codes", () => {
    expect(applyCoupon("   ").success).toBe(false);
    expect(applyCoupon("NOPE").success).toBe(false);
  });
});

describe("calculateDiscount", () => {
  it("returns 0 without a coupon", () => {
    expect(calculateDiscount(null, 1_000_000)).toBe(0);
  });

  it("applies a percentage coupon and rounds", () => {
    const { coupon } = applyCoupon("WELCOME10");
    expect(calculateDiscount(coupon, 1_000_000)).toBe(100_000);
    expect(calculateDiscount(coupon, 12_345)).toBe(1_235);
  });

  it("caps a fixed coupon at the cart total", () => {
    const { coupon } = applyCoupon("TECH50");
    expect(calculateDiscount(coupon, 20_000_000)).toBe(5_000_000);
    expect(calculateDiscount(coupon, 3_000_000)).toBe(3_000_000);
  });
});
