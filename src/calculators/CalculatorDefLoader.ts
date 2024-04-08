import {freeze} from "immer";
import _ from "lodash";
import {fetchJson, GuardedJsonLoader} from "@cinira-llc/util-js";
import {isChaseAroundCalcJson} from "./chase-around/chase-around-types";
import {isWpdProjectJson} from "../web-plot-digitizer/web-plot-digitizer-types";

import type {CalculatorDef} from ".";
import {isLoadEnvelopeCalcJson} from "./load-envelope/load-envelope-types";
import {isLoadArmsJson} from "./load-moment/load-moment-types";

/**
 * {@link CalculatorDefLoader} encapsulates the process of loading a performance calculator definition from a URL.
 */
export class CalculatorDefLoader {
    private constructor(private readonly loader: GuardedJsonLoader) {
    }

    /**
     * Load a performance calculator from a URL location.
     *
     * @param src the location.
     */
    async load(src: URL): Promise<CalculatorDef> {
        const {loader} = this;
        const def = await loader(src, isPerformanceCalculatorJson);
        if (isChaseAroundCalcJson(def)) {
            return freeze({
                kind: "chase around",
                definition: def,
                project: await loader(new URL(def.project.src, src), isWpdProjectJson)
            }, true);
        } else if (isLoadEnvelopeCalcJson(def)) {
            return freeze({
                kind: "load envelope",
                definition: def,
                project: await loader(new URL(def.project.src, src), isWpdProjectJson)
            }, true);
        } else if (isLoadArmsJson(def)) {
            return freeze({
                kind: "load moment",
                definition: def
            }, true);
        }
        throw Error("Unsupported chart or calculator type.");
    }

    /**
     * Create a {@link CalculatorDefLoader} instance.
     *
     * @param loader the URL fetch callback, primarily for testing.
     */
    static create(loader = fetchJson) {
        return freeze(new CalculatorDefLoader(loader), true);
    }
}

function isPerformanceCalculatorJson(val: unknown): val is { kind: string } {
    return _.isObject(val) && "kind" in val && _.isString(val.kind);
}
