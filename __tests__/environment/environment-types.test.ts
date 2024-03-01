import { isAltitude, isTemperature } from "../../src/environment";

describe("environment-types.ts", () => {
    describe("isAltitude()", () => {
        it("should identify altitude variables", () => {
            expect(isAltitude({ variable: "densityAltitude", unit: "feet" })).toBe(true);
            expect(isAltitude({ variable: "pressureAltitude", unit: "meters" })).toBe(true);
        });
    });
    describe("isTemperature()", () => {
        it("should identify a temperature variable", () => {
            expect(isTemperature({ variable: "outsideAirTemperature", unit: "degrees celsius" })).toBe(true);
            expect(isTemperature({ variable: "outsideAirTemperature", unit: "degrees fahrenheit" })).toBe(true);
        });
    });
});
