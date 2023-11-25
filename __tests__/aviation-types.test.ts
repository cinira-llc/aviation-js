import {isFlightPosition, isGeoCoordinates, isModeSCode} from "../src/aviation-types";

describe("aviation-types.ts", () => {
    describe("isModeSCode()", () => {
        test("Invalid Mode S code (uppercase)", () => {
            expect(isModeSCode("123ABC")).toBe(false);
        });
        test("Valid Mode S code", () => {
            expect(isModeSCode("123abc")).toBe(true);
        });
    });
    describe("isFlightPosition()", () => {
        test("Invalid flight position (no altitude)", () => {
            expect(isFlightPosition({coordinates: [0, 0]})).toBe(false);
        });
        test("Invalid flight position (no coordinates)", () => {
            expect(isFlightPosition({altitude: 123})).toBe(false);
        });
        test("Valid flight position", () => {
            expect(isFlightPosition({altitude: 123, coordinates: [0, 0]})).toBe(true);
        });
    });
    describe("isGeoCoordinates()", () => {
        test("Invalid coordinates (tuple too large)", () => {
            expect(isGeoCoordinates([0, 0, 0])).toBe(false);
        });
        test("Invalid coordinates (tuple too small)", () => {
            expect(isGeoCoordinates([0])).toBe(false);
        });
        test("Invalid coordinates (latitude out of range high)", () => {
            expect(isGeoCoordinates([91, 0])).toBe(false);
        });
        test("Invalid coordinates (latitude out of range low)", () => {
            expect(isGeoCoordinates([-91, 0])).toBe(false);
        });
        test("Invalid coordinates (longitude out of range high)", () => {
            expect(isGeoCoordinates([0, 181])).toBe(false);
        });
        test("Invalid coordinates (longitude out of range low)", () => {
            expect(isGeoCoordinates([0, -181])).toBe(false);
        });
        test("Valid coordinates", () => {
            expect(isGeoCoordinates([0, 0])).toBe(true);
        });
    });
});
