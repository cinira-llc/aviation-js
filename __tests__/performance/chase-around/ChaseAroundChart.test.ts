import cruiseAirspeedJson from "./cruise-airspeed.json";
import cruiseAirspeedProjJson from "./cruise-airspeed.wpd.json";
import { isChaseAroundChartDef, isWpdProject } from "../../../src/performance/chase-around/chase-around-types";
import { ChaseAroundChart } from "../../../src/performance/chase-around/ChaseAroundChart";

describe("ChaseAroundChart", () => {
    describe("create()", () => {
        it("parses the cruise-airspeed chart", () => {
            const src = new URL("http://charts-r-us.com/cruise-airspeed.json");
            if (!(isChaseAroundChartDef(cruiseAirspeedJson) && isWpdProject(cruiseAirspeedProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(cruiseAirspeedJson, cruiseAirspeedProjJson, src);
                expect(chart.meta.src.href).toBe(src.href);
                expect(chart.meta.image!.src.href).toBe("http://charts-r-us.com/cruise-airspeed.png");
                expect(chart.meta.image!.size).toEqual([978, 692]);
            }
        });
    });
});
