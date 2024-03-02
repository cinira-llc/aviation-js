import { freeze } from "immer";
import _ from "lodash";

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
    variable: typeof ALTITUDE[number];
    unit: typeof ALTITUDE_UNIT[number];
}

/**
 * Temperature variable.
 */
interface Temperature {
    variable: typeof TEMPERATURE[number];
    unit: typeof TEMPERATURE_UNIT[number];
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
const ALTITUDE = freeze(["densityAltitude", "pressureAltitude"]);

/**
 * Altitude units.
 */
const ALTITUDE_UNIT = freeze(["feet", "meters"]);

/**
 * Temperature variables.
 */
const TEMPERATURE = freeze(["outsideAirTemperature"]);

/**
 * Temperature units.
 */
const TEMPERATURE_UNIT = freeze(["degrees celsius", "degrees fahrenheit"]);
