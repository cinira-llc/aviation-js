import _ from "lodash";
import { isPoint } from "@mattj65817/util-js";

import type { Dimensions } from "@mattj65817/util-js";

/**
 * Metadata describing a performance chart and the location(s) from which it was loaded.
 */
export interface Chart {
    image: {
        src: URL;
        size: Dimensions;
    };
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
 * Type guard for {@link Chart}.
 *
 * @param val the value.
 */
export function isChart(val: unknown): val is Chart {
    return _.isObject(val)
        && "image" in val
        && _.isObject(val.image)
        && "src" in val.image
        && "size" in val.image
        && val.image.src instanceof URL
        && isPoint(val.image.size);
}
