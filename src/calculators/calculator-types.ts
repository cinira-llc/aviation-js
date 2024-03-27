import _ from "lodash";

import type {Dictionary} from "lodash";
import type {AnyUnit} from "../aviation-types";
import {ChaseAroundCalcJson, WpdProjectJson} from "./chase-around/chase-around-types";
import {LoadEnvelopeCalcJson} from "./load-envelope/load-envelope-types";
import {LoadArmsJson} from "./load-moment/load-moment-types";

/**
 * Public interface to an object which calculates one or more performance variables.
 */
export interface Calculator {

    /**
     * Input variable(s) required for the calculation.
     */
    inputs: Dictionary<{
        unit: AnyUnit;
        range?: [number, number];
    }>;

    /**
     * Output variable(s) produced by the calculation.
     */
    outputs: Dictionary<{
        unit: AnyUnit;
    }>;

    /**
     * Calculate output(s) from input(s).
     *
     * @param inputs the inputs.
     */
    calculate(inputs: Dictionary<number>): Calculation;
}

/**
 * Results of a performance calculation.
 */
export interface Calculation {

    /**
     * Inputs provided to the calculation.
     */
    inputs: Dictionary<number>;

    /**
     * Outputs produced by the calculation.
     */
    outputs: Dictionary<number>;
}

/**
 * Definition for a chase-around calculator.
 */
interface ChaseAroundCalcDef {
    kind: "chase around";
    definition: ChaseAroundCalcJson;
    project: WpdProjectJson;
}

/**
 * Definition for a load envelope calculator.
 */
interface LoadEnvelopeCalcDef {
    kind: "load envelope";
    definition: LoadEnvelopeCalcJson;
    project: WpdProjectJson;
}

/**
 * Definition for a load moment calculator.
 */
interface LoadMomentCalcDef {
    kind: "load moment";
    definition: LoadArmsJson;
}

/**
 * Definitions for all supported calculator types.
 */
export type CalculatorDef =
    | ChaseAroundCalcDef
    | LoadEnvelopeCalcDef
    | LoadMomentCalcDef;

/**
 * Type guard for {@link Calculation}.
 *
 * @param val the value.
 */
export function isCalculation(val: unknown): val is Calculation {
    return _.isObject(val)
        && "inputs" in val
        && "outputs" in val
        && _.isObject(val.inputs)
        && _.isObject(val.outputs);
}
