import cruiseAirspeedJson from "./cruise-airspeed.json";
import cruiseAirspeedProjJson from "./cruise-airspeed.wpd.json";
import { isChaseAroundChartDef } from "../../../../src/calculator/visual/chase-around/chase-around-types";
import { isWpdProject } from "../../../../src/calculator/visual/web-plot-digitizer/web-plot-digitizer-types";

describe("chase-around-types.ts", () => {
    describe("isChaseAroundChartDef()", () => {
        it("returns true for a chase-around chart definition", () => {
            expect(isChaseAroundChartDef(cruiseAirspeedJson)).toBe(true);
        });
    });
    describe("isWpdProject()", () => {
        it("returns true for a WebPlotDigitizer project", () => {
            expect(isWpdProject(cruiseAirspeedProjJson)).toBe(true);
        });
    });
});
