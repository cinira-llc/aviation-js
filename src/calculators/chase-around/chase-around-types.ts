import _ from "lodash";
import { Dimensions, isPath } from "@mattj65817/util-js";

import type { Path, Point } from "@mattj65817/util-js";
import type { PerformanceVariable } from "../../performance";
import type { Calculation } from "..";
import type { EnvironmentVariable } from "../../environment";
import { isCalculation } from "../calculator-types";
import { Direction } from "../../charts";

/**
 * Structure of a chase-around chart definition JSON file.
 */
export interface ChaseAroundCalcJson {
    kind: "chase around";
    version: "1.0";
    size: Dimensions;
    project: {
        src: string;
    };
    guides: {
        [name in GuideName]: {
            flow: Direction;
        };
    };
    scales: {
        [name in GuideName]: {
            flow: Direction;
            unit:
                | EnvironmentVariable["unit"]
                | PerformanceVariable["unit"];
            variable?:
                | EnvironmentVariable["variable"]
                | PerformanceVariable["variable"];
        };
    };
    steps: Step[];
}

/**
 * Results of a performance calculation produced from a chase-around chart.
 */
export interface ChaseAroundCalculation extends Calculation {
    /**
     * Visual path of scales which affected the solution.
     */
    scales: Path[];

    /**
     * Visual path through the chase-around chart.
     */
    solution: Path[];
}

/**
 * Conditional hash of JavaScript expressions to guide or scale names.
 */
export type GuideCondition = {
    [expr in string]: GuideName;
}

/**
 * Step to be taken during evaluation of a chase-around chart.
 */
export type Step =
    | Chase
    | Solve;

/**
 * JSON format of a WebPlotDigitizer project file (the subset of it that we care about.)
 */
export interface WpdProjectJson {
    version: [major: 4, minor: 2];
    datasetColl: {
        name: string;
        data: {
            value: Point;
        }[];
    }[];
}

/**
 * Type guard for {@link Chase}.
 *
 * @param val the value.
 */
export function isChase(val: unknown): val is Chase {
    return _.isObject(val)
        && "chase" in val
        && (
            _.isString(val.chase)
            || isGuideCondition(val.chase)
        );
}

/**
 * Type guard for {@link ChaseAroundCalcJson}.
 *
 * @param val the value to check.
 */
export function isChaseAroundCalcJson(val: unknown): val is ChaseAroundCalcJson {
    return _.isObject(val)
        && "kind" in val
        && "version" in val
        && "chase around" === val.kind
        && "1.0" === val.version;
}

/**
 * Type guard for {@link GuideCondition}.
 *
 * @param val the value.
 */
export function isGuideCondition(val: unknown): val is GuideCondition {
    return _.isObject(val)
        && -1 === _.values(val).findIndex(next => !_.isString(next));
}

/**
 * Type guard for {@link Solve}.
 *
 * @param val the value.
 */
export function isSolve(val: unknown): val is Solve {
    return _.isObject(val)
        && "solve" in val
        && _.isString(val.solve);
}

/**
 * Chase a guide or scale until its end or until its intersection with another guide or scale.
 */
export interface Chase {
    chase: GuideSpec;
    until?: GuideName;
}

/**
 * Reference to any guide or scale, explicit or conditional.
 */
export type GuideSpec =
    | Direction
    | GuideName
    | GuideCondition;

/**
 * Solve using a scale.
 */
export interface Solve {
    solve: GuideName;
}

/**
 * Type guard for {@link ChaseAroundCalculation}.
 *
 * @param val the value.
 */
export function isChaseAroundCalculation(val: unknown): val is ChaseAroundCalculation {
    return isCalculation(val)
        && "solution" in val
        && _.isArray(val.solution)
        && -1 === val.solution.findIndex(next => !isPath(next));
}

/**
 * Name of a guide or scale.
 */
type GuideName = string;
