import { isAirspeed, isCenterOfGravity, isClimbRate, isPower, isWeight } from "../../src/performance";

describe("performance-types.ts", () => {
    describe("isAirspeed()", () => {
        it("should identify airspeed variables", () => {
            expect(isAirspeed({ variable: "calibratedAirspeed", unit: "knots" })).toBe(true);
            expect(isAirspeed({ variable: "indicatedAirspeed", unit: "miles per hour" })).toBe(true);
            expect(isAirspeed({ variable: "trueAirspeed", unit: "knots" })).toBe(true);
        });
    });
    describe("isCenterOfGravity()", () => {
        it("should identify a center of gravity variable", () => {
            expect(isCenterOfGravity({ variable: "centerOfGravity", unit: "inches aft of datum" })).toBe(true);
        });
    });
    describe("isClimbRate()", () => {
        it("should identify climb rate variables", () => {
            expect(isClimbRate({ variable: "climbRate", unit: "feet per minute" })).toBe(true);
            expect(isClimbRate({ variable: "climbRate", unit: "meters per second" })).toBe(true);
        });
    });
    describe("isPower()", () => {
        it("should identify a power variable", () => {
            expect(isPower({ variable: "power", unit: "percent" })).toBe(true);
        });
    });
    describe("isWeight()", () => {
        it("should identify weight variables", () => {
            expect(isWeight({ variable: "emptyWeight", unit: "pounds" })).toBe(true);
            expect(isWeight({ variable: "rampWeight", unit: "kilograms" })).toBe(true);
            expect(isWeight({ variable: "weight", unit: "pounds" })).toBe(true);
        });
    });
});
