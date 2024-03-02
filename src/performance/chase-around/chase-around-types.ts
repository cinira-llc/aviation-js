import _ from "lodash";
import { Dimensions, Point } from "@mattj65817/util-js";

import { PerformanceVariable } from "../performance-types";
import { EnvironmentVariable } from "../../environment";

/**
 * Structure of a chase-around chart definition JSON file.
 */
export interface ChaseAroundChartDef {
    kind: "chase around";
    version: "1.0";
    image: {
        src: string;
        size: Dimensions;
    };
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
 * Cardinal direction through a chase-around chart.
 */
export type Direction =
    | "down"
    | "left"
    | "right"
    | "up";

/**
 * Step to be taken during evaluation of a chase-around chart.
 */
export type Step =
    | Chase
    | Solve;

/**
 * JSON format of a WebPlotDigitizer project file (the subset of it that we care about.)
 */
export interface WpdProject {
    version: [major: 4, minor: 2];
    datasetColl: {
        name: string;
        data: {
            value: Point;
        }[];
    }[];
}

/**
 * Type guard for {@link ChaseAroundChartDef}.
 *
 * @param val the value to check.
 */
export function isChaseAroundChartDef(val: unknown): val is ChaseAroundChartDef {
    return _.isObject(val)
        && "kind" in val
        && "version" in val
        && "chase around" === val.kind
        && "1.0" === val.version;
}

/**
 * Type guard for {@link WpdProject}.
 *
 * @param val the value.
 */
export function isWpdProject(val: unknown): val is WpdProject {
    return _.isObject(val)
        && "datasetColl" in val
        && "version" in val
        && _.isArray(val.version)
        && 4 === val.version[0]
        && 2 === val.version[1]
        && _.isArray(val.datasetColl)
        && -1 === val.datasetColl.findIndex(next => !(
            _.isObject(next)
            && "data" in next
            && _.isArray(next.data)
        ));
}

/**
 * Chase a guide or scale until its end or until its intersection with another guide or scale.
 */
interface Chase {
    chase: GuideSpec;
    until?: GuideName;
    advance?: false;
}

/**
 * Solve using a scale.
 */
interface Solve {
    solve: GuideName;
}

/**
 * Name of a guide or scale.
 */
type GuideName = string;

/**
 * Conditional hash of JavaScript expressions to guide or scale names.
 */
type GuideCondition = {
    [expr in string]: GuideName;
}

/**
 * Reference to any guide or scale, explicit or conditional.
 */
type GuideSpec =
    | Direction
    | GuideName
    | GuideCondition;
