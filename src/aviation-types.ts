import _ from "lodash";
import {EnvironmentUnit, EnvironmentVariable} from "./environment";
import {PerformanceUnit, PerformanceVariable} from "./performance";

/**
 * All known variable units.
 */
export type AnyUnit =
    | EnvironmentUnit
    | PerformanceUnit;

/**
 * All known variables.
 */
export type AnyVariable =
    | EnvironmentVariable
    | PerformanceVariable;

/**
 * Position of an aircraft in flight.
 */
export interface FlightPosition {
    altitude: number;
    coordinates: GeoCoordinates;
}

/**
 * Geographic coordinates.
 */
export type GeoCoordinates = [latitude: number, longitude: number];

/**
 * Mode-S code in lowercase hexadecimal format.
 */
export type ModeSCode = Lowercase<string>;

/**
 * Type guard for {@link FlightPosition}.
 *
 * @param value the value to check.
 */
export function isFlightPosition(value: unknown): value is FlightPosition {
    return _.isObject(value)
        && "altitude" in value
        && _.isNumber(value.altitude)
        && "coordinates" in value
        && isGeoCoordinates(value.coordinates);
}

/**
 * Type guard for {@link GeoCoordinates}.
 *
 * @param value the value to check.
 */
export function isGeoCoordinates(value: unknown): value is GeoCoordinates {
    return _.isArray(value)
        && 2 === value.length
        && _.isNumber(value[0])
        && value[0] >= -90
        && value[0] <= 90
        && _.isNumber(value[1])
        && value[1] >= -180
        && value[1] <= 180;
}

/**
 * Type guard for {@link ModeSCode}.
 *
 * @param value the value to check.
 */
export function isModeSCode(value: unknown): value is ModeSCode {
    return "string" === typeof value
        && /[0-9a-f]{6}/g.test(value);
}
