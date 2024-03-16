import centerOfGravityRangeJson from "./center-of-gravity-range.json";
import centerOfGravityRangeProjJson from "./center-of-gravity-range.wpd.json";
import {isLoadEnvelopeCalcJson} from "../../../src/calculators/load-envelope/load-envelope-types";
import {isWpdProjectJson} from "../../../src/web-plot-digitizer/web-plot-digitizer-types";
import {LoadEnvelopeCalculator} from "../../../src/calculators/load-envelope";

function createInstance(def: object, proj: object) {
    if (!isLoadEnvelopeCalcJson(def)) {
        expect(true).toBe(false);
    } else if (!isWpdProjectJson(proj)) {
        expect(true).toBe(false);
    } else {
        return LoadEnvelopeCalculator.create(def, proj);
    }
}

describe("LoadEnvelopeCalculator", () => {
    describe("create()", () => {
        describe("center-of-gravity-range", () => {
            it("parses inputs correctly", () => {
                const calc = createInstance(centerOfGravityRangeJson, centerOfGravityRangeProjJson);
                expect(calc!.inputs).toStrictEqual({
                    centerOfGravity: {
                        range: [2.4, 2.6],
                        unit: "meters aft of datum"
                    },
                    weight: {
                        range: [750, 1200],
                        unit: "kilograms"
                    }
                });
            });
        });
    });
    describe("calculate()", () => {
        describe("center-of-gravity-range", () => {
            const calc = createInstance(centerOfGravityRangeJson, centerOfGravityRangeProjJson);
            it("evaluates in 'gross weight increase only' range", () => {
                expect(calc).toBeInstanceOf(LoadEnvelopeCalculator);
                const calculation = calc!.calculate({
                    centerOfGravity: 2.53,
                    weight: 1_175
                });
                expect(calculation.inputs).toStrictEqual({
                    centerOfGravity: 2.53,
                    weight: 1_175
                });
                expect(calculation.outputs).toStrictEqual({});
                expect(calculation.scales).toStrictEqual([
                    [[383.7637, 530.3767], [383.7637, 117.6019]],
                    [[80.4132, 117.6019], [383.7637, 117.6019]]
                ]);
                expect(calculation.solution).toStrictEqual({
                    category: "normal",
                    position: [383.7637, 117.6019],
                    withinLimits: true
                });
            });
            it("evaluates in normal category", () => {
                const calc = createInstance(centerOfGravityRangeJson, centerOfGravityRangeProjJson);
                expect(calc).toBeInstanceOf(LoadEnvelopeCalculator);
                expect(calc!.calculate({
                    centerOfGravity: 2.43,
                    weight: 1_050
                }).solution).toStrictEqual({
                    category: "normal",
                    position: [160.2423, 235.5932],
                    withinLimits: true
                });
            });
            it("evaluates in utility category", () => {
                const calc = createInstance(centerOfGravityRangeJson, centerOfGravityRangeProjJson);
                expect(calc).toBeInstanceOf(LoadEnvelopeCalculator);
                expect(calc!.calculate({
                    centerOfGravity: 2.40,
                    weight: 975
                }).solution).toStrictEqual({
                    category: "utility",
                    position: [92.4849, 305.9791],
                    withinLimits: true
                });
            });
            it("evaluates in 'standard tank only' range", () => {
                const calc = createInstance(centerOfGravityRangeJson, centerOfGravityRangeProjJson);
                expect(calc).toBeInstanceOf(LoadEnvelopeCalculator);
                expect(calc!.calculate({
                    centerOfGravity: 2.58,
                    weight: 1_125
                }).solution).toStrictEqual({
                    position: [495.7191, 164.5258],
                    withinLimits: false,
                });
            });
        });
    });
});
