import { freeze } from "immer";
import _ from "lodash";
import { Dimensions } from "@mattj65817/util-js";

/**
 * Metadata describing a performance chart and the location(s) from which it was loaded.
 */
export interface ChartMetadata {
    src: URL;
    image?: {
        src: URL;
        size: Dimensions;
    };
}

/**
 * Performance variable and unit.
 */
export type PerformanceVariable =
    | Airspeed
    | CenterOfGravity
    | ClimbRate
    | Power
    | Weight;

/**
 * Type guard for {@link Airspeed}.
 *
 * @param val the value.
 */
export function isAirspeed(val: unknown): val is Airspeed {
    return isPerformanceVariableOf(val, AIRSPEED, AIRSPEED_UNIT);
}

/**
 * Type guard for {@link CenterOfGravity}.
 *
 * @param val the value.
 */
export function isCenterOfGravity(val: unknown): val is CenterOfGravity {
    return isPerformanceVariableOf(val, CENTER_OF_GRAVITY, CENTER_OF_GRAVITY_UNIT);
}

/**
 * Type guard for {@link ClimbRate}.
 *
 * @param val the value.
 */
export function isClimbRate(val: unknown): val is ClimbRate {
    return isPerformanceVariableOf(val, CLIMB_RATE, CLIMB_RATE_UNIT);
}

/**
 * Type guard for {@link Power}.
 *
 * @param val the value.
 */
export function isPower(val: unknown): val is Power {
    return isPerformanceVariableOf(val, POWER, POWER_UNIT);
}

/**
 * Type guard for {@link Weight}.
 *
 * @param val the value.
 */
export function isWeight(val: unknown): val is Weight {
    return isPerformanceVariableOf(val, WEIGHT, WEIGHT_UNIT);
}

/**
 * Indicated airspeed.
 */
interface Airspeed {
    variable: typeof AIRSPEED[number];
    unit: typeof AIRSPEED_UNIT[number];
}

/**
 * Airspeed variable.
 */
interface CenterOfGravity {
    variable: typeof CENTER_OF_GRAVITY[number];
    unit: typeof CENTER_OF_GRAVITY_UNIT[number];
}

/**
 * Airspeed variable.
 */
interface ClimbRate {
    variable: typeof CLIMB_RATE,
    unit: typeof CLIMB_RATE_UNIT[number];
}

/**
 * Airspeed variable.
 */
interface Power {
    variable: typeof POWER[number];
    unit: typeof POWER_UNIT[number];
}

/**
 * Airspeed variable.
 */
interface Weight {
    variable: typeof WEIGHT[number];
    unit: typeof WEIGHT_UNIT[number];
}

/**
 * Type guard for {@link PerformanceVariable}.
 *
 * @param val the value.
 * @param variables the variable names.
 * @param units the varible units.
 */
function isPerformanceVariableOf<V extends PerformanceVariable>(val: unknown, variables: string[], units: string[]): val is V {
    return _.isObject(val)
        && "variable" in val
        && "unit" in val
        && _.isString(val.variable)
        && _.isString(val.unit)
        && -1 !== variables.indexOf(val.variable)
        && -1 !== units.indexOf(val.unit);
}

/**
 * Airspeed variables.
 */
const AIRSPEED = freeze(["calibratedAirspeed", "indicatedAirspeed", "trueAirspeed"]);

/**
 * Airspeed units.
 */
const AIRSPEED_UNIT = freeze(["knots", "miles per hour"]);

/**
 * Center of gravity variables.
 */
const CENTER_OF_GRAVITY = freeze(["centerOfGravity"]);

/**
 * Center of gravity units.
 */
const CENTER_OF_GRAVITY_UNIT = freeze(["inches aft of datum"]);

/**
 * Climb rate variables.
 */
const CLIMB_RATE = freeze(["climbRate"]);

/**
 * Climb rate units.
 */
const CLIMB_RATE_UNIT = freeze(["feet per minute", "meters per second"]);

/**
 * Power variables.
 */
const POWER = freeze(["power"]);

/**
 * Power units.
 */
const POWER_UNIT = freeze(["percent"]);

/**
 * Weight variables.
 */
const WEIGHT = freeze(["emptyWeight", "rampWeight", "weight"]);

/**
 * Weight units.
 */
const WEIGHT_UNIT = freeze(["kilograms", "pounds"]);
