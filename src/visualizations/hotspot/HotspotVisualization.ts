import {freeze} from "immer";
import _ from "lodash";
import {scaledPath} from "@mattj65817/util-js";
import {WpdProject} from "../../web-plot-digitizer";
import {HotspotVisualizationJson} from "../visualizations-types";

import type {Dictionary} from "lodash";
import type {HotspotVisualizationDef} from "../visualizations-types";
import {Direction} from "../../charts";
import {WpdProjectDef} from "../../web-plot-digitizer/web-plot-digitizer-types";
import {AnyUnit} from "../../aviation-types";

export class HotspotVisualization {
    private constructor(
        public readonly variables: Dictionary<AnyUnit>,
        private readonly axes: HotspotVisualizationDef["axes"],
        private readonly project: WpdProject) {
    }

    /**
     * Get the point at which the ax(es) for a given set of values intersect.
     *
     * @param values the values.
     */
    public hotspot(values: Dictionary<number>) {
        const {axes, project} = this;
        const [[xV, x], [yV, y]] = _.map(axes, (axis, i) => {
            const dir: Direction = 0 === i ? "down" : "right";
            if (("guide") in axis) {
                return [0, project.guide(axis.guide, dir)] as const;
            }
            const {scale, unit, variable} = axis;
            return [values[variable || scale]!, project.scale(scale, variable || scale, unit, dir)] as const;
        });
        const hotspot = x.at(xV).intersection(y.at(yV));
        if (null != hotspot) {
            return scaledPath(hotspot, 4);
        }
    }

    static create(def: HotspotVisualizationDef) {
        const proj = WpdProject.createFromDef(def.project);
        const axes = _.cloneDeep(def.axes);
        const variables = _.transform(axes, (variables, axis) => {
            if ("scale" in axis) {
                const {scale, unit, variable} = axis;
                variables[variable || scale] = unit;
            }
        }, {} as Dictionary<AnyUnit>);
        return freeze(new HotspotVisualization(variables, axes, proj), true);
    }

    static load(def: HotspotVisualizationJson, proj: WpdProjectDef) {
        return freeze<HotspotVisualizationDef>({
            kind: "hotspot-visualization-def",
            project: _.cloneDeep(proj),
            axes: _.cloneDeep(def.axes)
        }, true);
    }
}
