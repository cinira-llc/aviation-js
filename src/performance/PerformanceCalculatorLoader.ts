import { freeze } from "immer";
import { fetchJson } from "@mattj65817/util-js";
import { ChaseAroundChart } from "./chase-around";
import { PerformanceCalculator } from "./performance-types";
import { isChaseAroundChartDef, WpdProject } from "./chase-around/chase-around-types";

/**
 * {@link PerformanceCalculatorLoader} encapsulates the process of loading a performance calculator from a URL.
 */
export class PerformanceCalculatorLoader {
    private constructor(private readonly fetch: typeof fetchJson) {
    }

    /**
     * Load a performance calculator from a URL location.
     *
     * @param src the location.
     */
    async load(src: URL): Promise<PerformanceCalculator> {
        const { fetch } = this;
        const def = await fetch<{ kind: string }>(src);
        if (isChaseAroundChartDef(def)) {
            const proj = await fetch<WpdProject>(new URL(def.project.src, src));
            return ChaseAroundChart.create(def, proj, src);
        }
        throw Error("Unsupported chart or calculator type.");
    }

    /**
     * Create a {@link PerformanceCalculatorLoader} instance.
     *
     * @param fetch the URL fetch callback, primarily for testing.
     */
    static create(fetch = fetchJson) {
        return freeze(new PerformanceCalculatorLoader(fetch), true);
    }
}
