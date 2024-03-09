import _ from "lodash";
import cruiseAirspeedJson from "./chase-around/cruise-airspeed.json";
import cruiseAirspeedProjJson from "./chase-around/cruise-airspeed.wpd.json";
import {CalculatorDefLoader} from "../../src";
import {ChaseAroundCalculator, isChaseAroundResult} from "../../src/performance/chase-around";
import {createCalculator} from "../../src/performance";

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
            expect(isChaseAroundResult(result)).toBe(true);
            expect(result.outputs["trueAirspeed"]).toBeCloseTo(118.46);
        });
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchTestJson<T>(src: string | URL): Promise<T> {
    switch (_.isString(src) ? src : src.href) {
        case "http://localhost/cruise-airspeed.json":
            return Promise.resolve(cruiseAirspeedJson as T);
        case "http://localhost/cruise-airspeed.wpd.json":
            return Promise.resolve(cruiseAirspeedProjJson as T);
        default:
            throw Error("Unsupported URL.");
    }
}
