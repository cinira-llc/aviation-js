import {AnyUnit, AnyVariable, isFlightPosition, isGeoCoordinates, isModeSCode} from "./aviation-types";
import {convertUnits} from "./conversion-utils";
import {CalculatorDefLoader, isPerformanceResult} from "./performance";
import {isChaseAroundResult} from "./performance/chase-around";

import type {FlightPosition, GeoCoordinates, ModeSCode} from "./aviation-types";
import type {CalculatorResult, Calculator} from "./performance";
import type {CalculatorDef} from "./performance";
import type {ChaseAroundResult} from "./performance/chase-around";

/* Library exports. */
export {
    AnyUnit,
    AnyVariable,
    Calculator,
    CalculatorDef,
    CalculatorDefLoader,
    CalculatorResult,
    ChaseAroundResult,
    FlightPosition,
    GeoCoordinates,
    ModeSCode,
    convertUnits,
    isChaseAroundResult,
    isFlightPosition,
    isGeoCoordinates,
    isModeSCode,
    isPerformanceResult,
};
