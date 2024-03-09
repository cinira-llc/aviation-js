import {freeze} from "immer";
import _ from "lodash";
import {fetchJson, GuardedJsonLoader} from "@mattj65817/util-js";

import {ChaseAroundChart} from "./chase-around";
import {PerformanceCalculator} from "./performance-types";
import {isChaseAroundChartDef, isWpdProject} from "./chase-around/chase-around-types";

/**
 * {@link PerformanceCalculatorLoader} encapsulates the process of loading a performance calculator from a URL.
 */
export class PerformanceCalculatorLoader {
    private constructor(private readonly loader: GuardedJsonLoader) {
    }

    /**
     * Load a performance calculator from a URL location.
     *
     * @param src the location.
     */
    async load(src: URL): Promise<PerformanceCalculator> {
        const {loader} = this;
        const def = await loader(src, isPerformanceCalculatorDef);
        if (isChaseAroundChartDef(def)) {
            const proj = await loader(new URL(def.project.src, src), isWpdProject);
            return ChaseAroundChart.create(def, proj, src);
        }
        throw Error("Unsupported chart or calculator type.");
    }

    /**
     * Create a {@link PerformanceCalculatorLoader} instance.
     *
     * @param loader the URL fetch callback, primarily for testing.
     */
    static create(loader = fetchJson) {
        return freeze(new PerformanceCalculatorLoader(loader), true);
    }
}

function isPerformanceCalculatorDef(val: unknown): val is { kind: string } {
    return _.isObject(val) && "kind" in val && _.isString(val.kind);
}
