import _ from "lodash";

import type { Point } from "@mattj65817/util-js";

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
 * Type guard for {@link WpdProjectJson}.
 *
 * @param val the value.
 */
export function isWpdProjectJson(val: unknown): val is WpdProjectJson {
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
