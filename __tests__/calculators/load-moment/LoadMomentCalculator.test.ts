import momentArmsJson from "./moment-arms.json";
import {isLoadArmsJson} from "../../../src/calculators/load-moment/load-moment-types";
import {LoadMomentCalculator} from "../../../src/calculators/load-moment/LoadMomentCalculator";

describe("LoadMomentCalculator", () => {
    describe("for load-arms definitions", () => {
        if (!isLoadArmsJson(momentArmsJson)) {
            expect(true).toBe(false);
            throw Error();
        }
        const calc = LoadMomentCalculator.create(momentArmsJson);
        describe("calculate()", () => {
            it("assumes zero for missing stations", () => {
                expect(calc.calculate({})).toStrictEqual({
                    inputs: {},
                    outputs: {
                        centerOfGravity: 0,
                        weight: 0
                    }
                });
            });
            it("calculates center of gravity and total weight", () => {
                const inputs = {
                    frontSeats: 115,
                    fuel: 136.078,
                    rearSeats: 100,
                    oil: 0.9,
                    aftExtendedBaggage: 10,
                    forwardExtendedBaggage: 20,
                    baggageTube: 5,
                    standardBaggage: 5
                };
                const result = calc.calculate(inputs);
                expect(result.inputs).toStrictEqual(inputs);
                expect(result.outputs["weight"]).toBeCloseTo(391.978, 3);
                expect(result.outputs["centerOfGravity"]).toBeCloseTo(2.835, 3);
            });
        });
    });
});
