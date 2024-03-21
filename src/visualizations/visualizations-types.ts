import _ from "lodash";
import {AnyUnit} from "../aviation-types";
import {WpdProjectDef} from "../web-plot-digitizer/web-plot-digitizer-types";

export type VisualizationDef =
    | HotspotVisualizationDef;

export type VisualizationJson =
    | HotspotVisualizationJson;

/**
 * Serializable form of a {@link HotspotVisualization}.
 */
export interface HotspotVisualizationDef {
    kind: "hotspot-visualization-def";
    project: WpdProjectDef;
    axes: HotspotVisualizationJson["axes"];
}

/**
 * Definition of a hotspot visualization/
 */
export interface HotspotVisualizationJson {
    kind: "hotspot-visualization";
    version: "1";
    project: {
        src: string;
    };
    axes: [
        x: AxisSpec,
        y: AxisSpec
    ];
}

type AxisSpec =
    | { guide: string }
    | {
    scale: string;
    unit: AnyUnit;
    variable?: string;
};

/**
 * Type guard for {@link HotspotVisualizationDef}.
 *
 * @param val the value.
 */
export function isHotspotVisualizationDef(val: unknown): val is HotspotVisualizationDef {
    return _.isObject(val)
        && "kind" in val
        && "hotspot-visualization-def" === val.kind;
}

/**
 * Type guard for {@link HotspotVisualizationJson}.
 *
 * @param val the value.
 */
export function isHotspotVisualizationJson(val: unknown): val is HotspotVisualizationJson {
    return _.isObject(val)
        && "kind" in val
        && "project" in val
        && "axes" in val
        && "version" in val
        && "hotspot-visualization" === val.kind
        && "1" === val.version
        && _.isObject(val.project)
        && "src" in val.project
        && _.isString(val.project.src)
        && _.isArray(val.axes)
        && 2 === val.axes.length;
}

/**
 * Type guard for {@link VisualizationJson}.
 *
 * @param val the value.
 */
export function isVisualizationJson(val: unknown): val is VisualizationJson {
    return isHotspotVisualizationJson(val);
}
