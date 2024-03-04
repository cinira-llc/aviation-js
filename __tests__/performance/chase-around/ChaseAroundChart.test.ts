import cruiseAirspeedJson from "./cruise-airspeed.json";
import cruiseAirspeedProjJson from "./cruise-airspeed.wpd.json";
import landingDistanceJson from "./landing-distance.json";
import landingDistanceProjJson from "./landing-distance.wpd.json";
import { isChaseAroundChartDef, isWpdProject, Step } from "../../../src/performance/chase-around/chase-around-types";
import { ChaseAroundChart } from "../../../src/performance/chase-around/ChaseAroundChart";
import { CalcContext } from "../../../src/performance/chase-around/CalcContext";

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
    describe("calculate()", () => {
        it("solves the cruise-airspeed sample problem", () => {
            const src = new URL("http://charts-r-us.com/cruise-airspeed.json");
            if (!(isChaseAroundChartDef(cruiseAirspeedJson) && isWpdProject(cruiseAirspeedProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(cruiseAirspeedJson, cruiseAirspeedProjJson, src);
                const context = chart.calculate({
                    outsideAirTemperature: 15,
                    power: 55,
                    pressureAltitude: 5_000,
                });
                console.log(toSvgPath(context.steps));
                expect(context.outputs["trueAirspeed"]).toBeCloseTo(118.46);
            }
        });
        it("solves the landing-distance sample problem", () => {
            const src = new URL("http://charts-r-us.com/landing-distance.json");
            if (!(isChaseAroundChartDef(landingDistanceJson) && isWpdProject(landingDistanceProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(landingDistanceJson, landingDistanceProjJson, src);
                const context = chart.calculate({
                    obstacleHeight: 0,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                console.log(toSvgPath(context.steps));
                expect(context.outputs["trueAirspeed"]).toBeCloseTo(118.46);
            }
        });
    });
});

function toSvgPath(steps: CalcContext["steps"]): string {
    return steps.reduce((acc, { along: { path } }) => {
        return path.reduce((acc, [x, y]) => {
            if ("" === acc) {
                return `M ${x} ${y}`;
            }
            return `${acc} L ${x} ${y}`;
        }, acc);
    }, "");
}
