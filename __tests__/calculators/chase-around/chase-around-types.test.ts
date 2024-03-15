import cruiseAirspeedJson from "./cruise-airspeed.json";
import cruiseAirspeedProjJson from "./cruise-airspeed.wpd.json";
import { isChaseAroundCalcJson, isWpdProjectJson } from "../../../src/calculators/chase-around/chase-around-types";

describe("chase-around-types.ts", () => {
    describe("isChaseAroundChartDef()", () => {
        it("returns true for a chase-around chart definition", () => {
            expect(isChaseAroundCalcJson(cruiseAirspeedJson)).toBe(true);
        });
    });
    describe("isWpdProject()", () => {
        it("returns true for a WebPlotDigitizer project", () => {
            expect(isWpdProjectJson(cruiseAirspeedProjJson)).toBe(true);
        });
    });
});
