import {freeze} from "immer";
import {fetchJson} from "@cinira-llc/util-js";
import {WpdProject} from "../web-plot-digitizer";
import {HotspotVisualization} from "./hotspot";
import {isWpdProjectJson} from "../web-plot-digitizer/web-plot-digitizer-types";
import {isHotspotVisualizationDef, isHotspotVisualizationJson, isVisualizationJson,} from "./visualizations-types";

import type {GuardedJsonLoader} from "@cinira-llc/util-js";
import type {VisualizationDef} from "./visualizations-types";

export class VisualizationLoader {
    private constructor(private readonly loader: GuardedJsonLoader) {
    }

    public create(def: VisualizationDef) {
        if (isHotspotVisualizationDef(def)) {
            return HotspotVisualization.create(def);
        }
        throw Error("Unsupported visualization type.");
    }

    public async load(src: URL) {
        const {loader} = this;
        const json = await loader(src, isVisualizationJson);
        if (isHotspotVisualizationJson(json)) {
            const projJson = await loader(new URL(json.project.src, src), isWpdProjectJson);
            const proj = WpdProject.load(projJson);
            return HotspotVisualization.load(json, proj);
        }
        throw Error("Unsupported visualization type.");
    }

    static create(loader = fetchJson) {
        return freeze(new VisualizationLoader(loader), true);
    }
}
