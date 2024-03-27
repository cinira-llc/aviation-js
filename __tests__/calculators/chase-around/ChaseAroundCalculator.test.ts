import _ from "lodash";
import {isChaseAroundCalcJson} from "../../../src/calculators/chase-around/chase-around-types";
import {ChaseAroundCalculator} from "../../../src/calculators/chase-around";
import {isWpdProjectJson} from "../../../src/web-plot-digitizer/web-plot-digitizer-types";

import type {Path} from "@mattj65817/util-js";

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

describe("ChaseAroundChart", () => {
    describe("calculate()", () => {
        it("solves the cruise-airspeed sample problem", () => {
            if (!(isChaseAroundCalcJson(cruiseAirspeedJson) && isWpdProjectJson(cruiseAirspeedProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundCalculator.create(cruiseAirspeedJson, cruiseAirspeedProjJson);
                const result = chart.calculate({
                    outsideAirTemperature: 15,
                    power: 55,
                    pressureAltitude: 5_000,
                });
                expect(result.inputs).toEqual({
                    outsideAirTemperature: 15,
                    power: 55,
                    pressureAltitude: 5_000,
                });
                expect(_.keys(result.outputs)).toEqual(["trueAirspeed"]);
                expect(result.outputs["trueAirspeed"]).toBeCloseTo(118.46);
            }
        });
        it("solves the landing-distance sample problem", () => {
            if (!(isChaseAroundCalcJson(landingDistanceJson) && isWpdProjectJson(landingDistanceProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundCalculator.create(landingDistanceJson, landingDistanceProjJson);
                const result = chart.calculate({
                    obstacleHeight: 0,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                expect(result.inputs).toEqual({
                    obstacleHeight: 0,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                expect(_.keys(result.outputs)).toEqual(["landingDistance"]);
                expect(result.outputs["landingDistance"]).toBeCloseTo(199.97);
            }
        });
        it("solves the landing-distance-flaps-up sample problem", () => {
            if (!(isChaseAroundCalcJson(landingDistanceFlapsUpJson) && isWpdProjectJson(landingDistanceFlapsUpProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundCalculator.create(landingDistanceFlapsUpJson, landingDistanceFlapsUpProjJson);
                const result = chart.calculate({
                    obstacleHeight: 0,
                    outsideAirTemperature: 10,
                    pressureAltitude: 4_000,
                    weight: 1_000,
                    windComponent: 8,
                });
                expect(result.inputs).toEqual({
                    obstacleHeight: 0,
                    outsideAirTemperature: 10,
                    pressureAltitude: 4_000,
                    weight: 1_000,
                    windComponent: 8,
                });
                expect(_.keys(result.outputs)).toEqual(["landingDistance"]);
                expect(result.outputs["landingDistance"]).toBeCloseTo(272.26);
            }
        });
        it("solves the takeoff-climb-rate sample problem", () => {
            if (!(isChaseAroundCalcJson(takeoffClimbRateJson) && isWpdProjectJson(takeoffClimbRateProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundCalculator.create(takeoffClimbRateJson, takeoffClimbRateProjJson);
                const result = chart.calculate({
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                });
                expect(result.inputs).toEqual({
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                });
                expect(_.keys(result.outputs)).toEqual(["climbRate"]);
                expect(result.outputs["climbRate"]).toBeCloseTo(987.17);
            }
        });
        it("solves the takeoff-distance sample problem", () => {
            if (!(isChaseAroundCalcJson(takeoffDistanceJson) && isWpdProjectJson(takeoffDistanceProjJson))) {
                expect(true).toBe(false);
            } else {
                const chart = ChaseAroundCalculator.create(takeoffDistanceJson, takeoffDistanceProjJson);
                const result = chart.calculate({
                    obstacleHeight: 15,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                expect(result.inputs).toEqual({
                    obstacleHeight: 15,
                    outsideAirTemperature: 15,
                    pressureAltitude: 2_000,
                    weight: 1_000,
                    windComponent: 10,
                });
                expect(_.keys(result.outputs)).toEqual(["takeoffDistance"]);
                expect(result.outputs["takeoffDistance"]).toBeCloseTo(302.98);
                expect(toSvgPath(result.solution)).toEqual("M 11.8178 537.1747 L 85.2317 527.1475 L 232.7757 501.3631 L 268.2292 492.8054 M 268.2292 492.8054 L 548.9926 492.8054 M 548.9926 492.8054 L 644.2515 547.5632 M 644.2515 547.5632 L 738.5747 547.5632 M 738.5747 547.5632 L 822.5936 575.775 M 822.5936 575.775 L 929.3123 575.775 M 929.3123 575.775 L 977.658 524.1605 M 977.658 524.1605 L 987.3271 524.1605 M 987.3271 524.1605 L 1003.0843 524.1605");
                expect(toSvgPath(result.scales)).toEqual("M 268.2292 622.0483 L 268.2292 492.8054 M 644.2515 623.1227 L 644.2515 547.5632 M 822.5936 623.1227 L 822.5936 575.775 M 977.658 623.1227 L 977.658 524.1605");
            }
        });
    });
});

function toSvgPath(paths: Path[]): string {
    return _.trim(paths.reduce((acc, path) => {
        return path.reduce((acc, [x, y], index) => {
            if (0 === index) {
                return `${acc} M ${x} ${y}`;
            }
            return `${acc} L ${x} ${y}`;
        }, acc);
    }, ""));
}
