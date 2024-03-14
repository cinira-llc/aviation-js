import _ from "lodash";
import { AnyUnit } from "../aviation-types";

/**
 * Public interface to an object which calculates one or more performance variables.
 */
export interface Calculator {

    /**
     * Input variable(s) required for the calculation.
     */
    inputs: Record<string, {
        unit: AnyUnit;
        range?: [number, number];
    }>;

    /**
     * Output variable(s) produced by the calculation.
     */
    outputs: Record<string, {
        unit: AnyUnit;
    }>;

    /**
     * Calculate output(s) from input(s).
     *
     * @param inputs the inputs.
     */
    calculate(inputs: Record<string, number>): Calculation;
}

/**
 * Results of a performance calculation.
 */
export interface Calculation {

    /**
     * Inputs provided to the calculation.
     */
    inputs: Record<string, number>;

    /**
     * Outputs produced by the calculation.
     */
    outputs: Record<string, number>;
}

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
