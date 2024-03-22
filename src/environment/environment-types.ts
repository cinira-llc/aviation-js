import {freeze} from "immer";
import _ from "lodash";

/**
 * All environment-related units.
 */
export type EnvironmentUnit =
    | EnvironmentVariable["unit"]
    | typeof LENGTH_UNIT[number];

/**
 * Environmental variable and unit.
 */
export type EnvironmentVariable =
    | Altitude
    | Temperature;

/**
 * Type guard for {@link Altitude}.
 *
 * @param val the value.
 */
export function isAltitude(val: unknown): val is Altitude {
    return isEnvironmentVariableOf(val, ALTITUDE, ALTITUDE_UNIT);
}

/**
 * Type guard for {@link Temperature}.
 *
 * @param val the value.
 */
export function isTemperature(val: unknown): val is Temperature {
    return isEnvironmentVariableOf(val, TEMPERATURE, TEMPERATURE_UNIT);
}

/**
 * Altitude variable.
 */
interface Altitude {
    variable:
        | "densityAltitude"
        | "pressureAltitude";
    unit:
        | "feet"
        | "meters";
}

/**
 * Temperature variable.
 */
interface Temperature {
    variable: "outsideAirTemperature";
    unit:
        | "degrees celsius"
        | "degrees fahrenheit";
}

/**
 * Type guard for {@link EnvironmentVariable}.
 *
 * @param val the value.
 * @param variables the variable names.
 * @param units the varible units.
 */
function isEnvironmentVariableOf<V extends EnvironmentVariable>(val: unknown, variables: string[], units: string[]): val is V {
    return _.isObject(val)
        && "variable" in val
        && "unit" in val
        && _.isString(val.variable)
        && _.isString(val.unit)
        && -1 !== variables.indexOf(val.variable)
        && -1 !== units.indexOf(val.unit);
}

/**
 * Altitude variables.
 */
const ALTITUDE = freeze<Altitude["variable"][]>(["densityAltitude", "pressureAltitude"]);

/**
 * Altitude units.
 */
const ALTITUDE_UNIT = freeze<Altitude["unit"][]>(["feet", "meters"]);

/**
 * Temperature variables.
 */
const TEMPERATURE = freeze<Temperature["variable"][]>(["outsideAirTemperature"]);

/**
 * Temperature units.
 */
const TEMPERATURE_UNIT = freeze<Temperature["unit"][]>(["degrees celsius", "degrees fahrenheit"]);

const LENGTH_UNIT = freeze(["inches"] as const);
