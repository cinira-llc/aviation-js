import _ from "lodash";

import cruiseAirspeedJson from "./cruise-airspeed.json";
import cruiseAirspeedProjJson from "./cruise-airspeed.wpd.json";
import landingDistanceFlapsUpJson from "./landing-distance-flaps-up.json";
import landingDistanceFlapsUpProjJson from "./landing-distance-flaps-up.wpd.json";
import landingDistanceJson from "./landing-distance.json";
import landingDistanceProjJson from "./landing-distance.wpd.json";
import takeoffClimbRateJson from "./takeoff-climb-rate.json";
import takeoffClimbRateProjJson from "./takeoff-climb-rate.wpd.json";
import takeoffDistanceJson from "./takeoff-distance.json";
import takeoffDistanceProjJson from "./takeoff-distance.wpd.json";
import { isChaseAroundChartDef, isWpdProject } from "../../../src/performance/chase-around/chase-around-types";
import { ChaseAroundChart } from "../../../src/performance/chase-around/ChaseAroundChart";
import { Contour } from "../../../src/performance/chase-around/Contour";

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
                const result = chart.calculate({
                    outsideAirTemperature: 15,
                    power: 55,
                    pressureAltitude: 5_000,
                });
                expect(_.keys(result)).toEqual(["trueAirspeed"]);
                expect(result["trueAirspeed"]).toBeCloseTo(118.46);
            }
        });
        it("solves the landing-distance sample problem", () => {
            const src = new URL("http://charts-r-us.com/landing-distance.json");
            if (!(isChaseAroundChartDef(landingDistanceJson) && isWpdProject(landingDistanceProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(landingDistanceJson, landingDistanceProjJson, src);
                const result = chart.calculate({
                    obstacleHeight: 0,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                expect(_.keys(result)).toEqual(["landingDistance"]);
                expect(result["landingDistance"]).toBeCloseTo(199.97);
            }
        });
        it("solves the landing-distance-flaps-up sample problem", () => {
            const src = new URL("http://charts-r-us.com/landing-distance-flaps-up.json");
            if (!(isChaseAroundChartDef(landingDistanceFlapsUpJson) && isWpdProject(landingDistanceFlapsUpProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(landingDistanceFlapsUpJson, landingDistanceFlapsUpProjJson, src);
                const result = chart.calculate({
                    obstacleHeight: 0,
                    outsideAirTemperature: 10,
                    pressureAltitude: 4_000,
                    weight: 1_000,
                    windComponent: 8,
                });
                expect(_.keys(result)).toEqual(["landingDistance"]);
                expect(result["landingDistance"]).toBeCloseTo(272.26);
            }
        });
        it("solves the takeoff-climb-rate sample problem", () => {
            const src = new URL("http://charts-r-us.com/takeoff-climb-rate.json");
            if (!(isChaseAroundChartDef(takeoffClimbRateJson) && isWpdProject(takeoffClimbRateProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(takeoffClimbRateJson, takeoffClimbRateProjJson, src);
                const result = chart.calculate({
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000
                });
                expect(_.keys(result)).toEqual(["climbRate"]);
                expect(result["climbRate"]).toBeCloseTo(987.17);
            }
        });
        it("solves the takeoff-distance sample problem", () => {
            const src = new URL("http://charts-r-us.com/takeoff-distance.json");
            if (!(isChaseAroundChartDef(takeoffDistanceJson) && isWpdProject(takeoffDistanceProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundChart.create(takeoffDistanceJson, takeoffDistanceProjJson, src);
                const result = chart.calculate({
                    obstacleHeight: 15,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                expect(_.keys(result)).toEqual(["takeoffDistance"]);
                expect(result["takeoffDistance"]).toBeCloseTo(302.98);
            }
        });
    });
});

function toSvgPath(contours: Contour[]): string {
    return contours.reduce((acc, { path }) => {
        return path.reduce((acc, [x, y]) => {
            if ("" === acc) {
                return `M ${x} ${y}`;
            }
            return `${acc} L ${x} ${y}`;
        }, acc);
    }, "");
}
