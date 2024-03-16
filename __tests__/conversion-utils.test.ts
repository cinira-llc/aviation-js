import { convertUnits } from "../src";
import { indicatedToPressureAltitude } from "../src/conversion-utils";

describe("conversion-utils.ts", () => {
    describe("convertUnits()", () => {
        it("converts celsius to fahrenheit", () => {
            expect(convertUnits(0, "degrees celsius", "degrees fahrenheit")).toBeCloseTo(32);
            expect(convertUnits(15, "degrees celsius", "degrees fahrenheit")).toBeCloseTo(59);
            expect(convertUnits(-40, "degrees celsius", "degrees fahrenheit")).toBeCloseTo(-40);
        });
        it("converts fahrenheit to celsius", () => {
            expect(convertUnits(32, "degrees fahrenheit", "degrees celsius")).toBeCloseTo(0);
            expect(convertUnits(59, "degrees fahrenheit", "degrees celsius")).toBeCloseTo(15);
            expect(convertUnits(-40, "degrees fahrenheit", "degrees celsius")).toBeCloseTo(-40);
        });
        it("converts feet to meters", () => {
            expect(convertUnits(1_000, "feet", "meters")).toBeCloseTo(304.8, 1);
        });
        it("converts gallons to liters", () => {
            expect(convertUnits(1_000, "gallons", "liters")).toBeCloseTo(3785.4, 1);
        });
        it("converts liters to gallons", () => {
            expect(convertUnits(1_000, "liters", "gallons")).toBeCloseTo(264.2, 1);
        });
        it("converts meters to feet", () => {
            expect(convertUnits(15, "meters", "feet")).toBeCloseTo(49.2, 1);
        });
        it("converts pounds to kilograms", () => {
            expect(convertUnits(2646, "pounds", "kilograms")).toBeCloseTo(1200.2, 1);
        });
        it("converts kilograms to pounds", () => {
            expect(convertUnits(1200, "kilograms", "pounds")).toBeCloseTo(2645.5, 1);
        });
        it("throws a descriptive error if no conversion is provided", () => {
            expect(() => convertUnits(0, "degrees celsius", "kilograms")).toThrow("No conversion: degrees celsius to kilograms");
        });
    });
    describe("indicatedToPressureAltitude()", () => {
        it("should convert indicated altitude to pressure altitude", () => {
            expect(indicatedToPressureAltitude(2_000, 30.15)).toBeCloseTo(1_787.9, 1);
            expect(indicatedToPressureAltitude(4_000, 27.65)).toBeCloseTo(6_167.1, 1);
        });
    });
});
