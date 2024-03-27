import _ from "lodash";
import {CalculatorDefLoader, isLoadEnvelopeCalculation} from "../../src";
import {ChaseAroundCalculator, isChaseAroundCalculation} from "../../src/calculators/chase-around";
import {LoadEnvelopeCalculator} from "../../src/calculators/load-envelope";
import {createCalculator} from "../../src";

import cruiseAirspeedJson from "./chase-around/cruise-airspeed.json";
import cruiseAirspeedProjJson from "./chase-around/cruise-airspeed.wpd.json";
import centerOfGravityRangeJson from "./load-envelope/center-of-gravity-range.json";
import centerOfGravityRangeProjJson from "./load-envelope/center-of-gravity-range.wpd.json";
import momentArmsJson from "./load-moment/moment-arms.json";
import {LoadMomentCalculator} from "../../src/calculators/load-moment";

describe("CalculatorDefLoader", () => {
    describe("load()", () => {
        const instance = CalculatorDefLoader.create(fetchTestJson);
        it("loads the cruise-airspeed chart", async () => {
            const def = await instance.load(new URL("http://localhost/cruise-airspeed.json"));
            const chart = createCalculator(def);
            expect(chart).toBeInstanceOf(ChaseAroundCalculator);
            const result = chart.calculate({
                outsideAirTemperature: 15,
                power: 55,
                pressureAltitude: 5_000,
            });
            expect(isChaseAroundCalculation(result)).toBe(true);
            expect(result.outputs["trueAirspeed"]).toBeCloseTo(118.46);
        });
        it("loads the center-of-gravity-range chart", async () => {
            const def = await instance.load(new URL("http://localhost/center-of-gravity-range.json"));
            const chart = createCalculator(def);
            expect(chart).toBeInstanceOf(LoadEnvelopeCalculator);
            const result = chart.calculate({
                centerOfGravity: 2.5,
                weight: 1_000
            });
            expect(isLoadEnvelopeCalculation(result)).toBe(true);
            if (isLoadEnvelopeCalculation(result)) {
                expect(result.solution.withinLimits).toBe(true);
                expect(result.solution.category).toBe("normal");
            }
        });
        it("loads the moment-arms calculator", async () => {
            const def = await instance.load(new URL("http://localhost/moment-arms.json"));
            const calc = createCalculator(def);
            expect(calc).toBeInstanceOf(LoadMomentCalculator);
            const result = calc.calculate({});
            expect(result.outputs).toStrictEqual({
                centerOfGravity: 0,
                weight: 0
            });
        })
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchTestJson<T>(src: string | URL): Promise<T> {
    switch (_.isString(src) ? src : src.href) {
        case "http://localhost/center-of-gravity-range.json":
            return Promise.resolve(centerOfGravityRangeJson as T);
        case "http://localhost/center-of-gravity-range.wpd.json":
            return Promise.resolve(centerOfGravityRangeProjJson as T);
        case "http://localhost/cruise-airspeed.json":
            return Promise.resolve(cruiseAirspeedJson as T);
        case "http://localhost/cruise-airspeed.wpd.json":
            return Promise.resolve(cruiseAirspeedProjJson as T);
        case "http://localhost/moment-arms.json":
            return Promise.resolve(momentArmsJson as T);
        default:
            throw Error("Unsupported URL.");
    }
}
