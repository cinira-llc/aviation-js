import _ from "lodash";

import {Dimensions, isPath, Path, Point} from "@cinira-llc/util-js";
import type {Direction} from "../../charts";
import type {PerformanceVariable} from "../../performance";
import {Calculation, isCalculation} from "../calculator-types";

/**
 * Structure of a load-envelope chart definition JSON file.
 */
export interface LoadEnvelopeCalcJson {
    kind: "load-envelope";
    version: "1";
    size: Dimensions;
    project: {
        src: string;
    };
    areas: {
        area: AreaName;
        withinLimits: boolean;
        category:
            | "normal"
            | "utility";
    }[];
    scales: Record<ScaleName, {
        flow: Direction;
        unit: PerformanceVariable["unit"];
        variable?: PerformanceVariable["variable"];
    }>;
}

/**
 * Results of a performance calculation produced from a chase-around chart.
 */
export interface LoadEnvelopeCalculation extends Calculation {

    /**
     * Visual path of scales which affected the solution.
     */
    scales: [Path, Path];

    /**
     * Position on the load envelope.
     */
    solution: {
        position: Point;
        withinLimits: boolean;
        category?:
            | "normal"
            | "utility";
    };
}


/**
 * Type guard for {@link LoadEnvelopeCalcJson}.
 *
 * @param val the value.
 */
export function isLoadEnvelopeCalcJson(val: unknown): val is LoadEnvelopeCalcJson {
    return _.isObject(val)
        && "kind" in val
        && "version" in val
        && "load-envelope" === val.kind
        && "1" === val.version;
}

/**
 * Type guard for {@link LoadEnvelopeCalculation}.
 *
 * @param val the value.
 */
export function isLoadEnvelopeCalculation(val: unknown): val is LoadEnvelopeCalculation {
    return isCalculation(val)
        && "scales" in val
        && "solution" in val
        && _.isObject(val.solution)
        && _.isArray(val.scales)
        && -1 === val.scales.findIndex(scale => !isPath(scale));
}

type AreaName = string;
type ScaleName = string;
