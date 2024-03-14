import { freeze } from "immer";
import { fetchJson } from "@mattj65817/util-js";
import { ChaseAroundChart } from "./visual/chase-around";
import { isChaseAroundChartDef } from "./visual/chase-around/chase-around-types";

import type { WpdProjectJson } from "./visual/web-plot-digitizer/web-plot-digitizer-types";
import type { Calculator } from ".";

/**
 * {@link CalculatorLoader} encapsulates the process of loading a performance calculator from a URL.
 */
export class CalculatorLoader {
    private constructor(private readonly fetch: typeof fetchJson) {
    }

    /**
     * Load a performance calculator from a URL location.
     *
     * @param src the location.
     */
    async load(src: URL): Promise<Calculator> {
        const { fetch } = this;
        const def = await fetch<{ kind: string }>(src);
        if (isChaseAroundChartDef(def)) {
            const proj = await fetch<WpdProjectJson>(new URL(def.project.src, src));
            return ChaseAroundChart.create(def, proj, src);
        }
        throw Error("Unsupported chart or calculator type.");
    }

    /**
     * Create a {@link CalculatorLoader} instance.
     *
     * @param fetch the URL fetch callback, primarily for testing.
     */
    static create(fetch = fetchJson) {
        return freeze(new CalculatorLoader(fetch), true);
    }
}
