import _ from "lodash";
import {CalculatorDefLoader, createCalculator} from "../../src";
import centerOfGravityRangeJson from "../calculators/load-envelope/center-of-gravity-range.json";
import centerOfGravityRangeProjJson from "../calculators/load-envelope/center-of-gravity-range.wpd.json";

async function load<T>(location: string | URL) {
    if (location instanceof URL) {
        location = location.pathname;
    }
    if (location.endsWith("/center-of-gravity-range.json")) {
        return centerOfGravityRangeJson as T;
    } else if (location.endsWith("/center-of-gravity-range.wpd.json")) {
        return centerOfGravityRangeProjJson as T;
    }
    throw Error();
}

describe("calculator-utils", () => {
    describe("createCalculator()", () => {
        it("loads from a definition", async () => {
            const loader = CalculatorDefLoader.create(load);
            const def = await loader.load(new URL("file:///./__tests__/calculators/load-envelope/center-of-gravity-range.json"));
            const calc = createCalculator(def);
            expect(_.keys(calc.inputs).sort()).toStrictEqual(["centerOfGravity", "weight"]);
            expect(calc.inputs["centerOfGravity"].unit).toBe("meters aft of datum");
            expect(calc.inputs["centerOfGravity"].range).toStrictEqual([2.4, 2.6]);
            expect(calc.inputs["weight"].unit).toBe("kilograms");
            expect(calc.inputs["weight"].range).toStrictEqual([750, 1_200]);
        });
    });
});
