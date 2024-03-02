import { freeze } from "immer";
import _ from "lodash";
import { scaledPath, sortedPath } from "@mattj65817/util-js";
import { Guide } from "./Guide";

import type { Path } from "@mattj65817/util-js";
import type { ChartMetadata } from "../performance-types";
import type { ChaseAroundChartDef, Direction, Step, WpdProject } from "./chase-around-types";

export class ChaseAroundChart {
    private constructor(private readonly steps: Step[], public readonly meta: ChartMetadata) {
    }

    static create(def: ChaseAroundChartDef, proj: WpdProject, src: URL) {

        /* Parse datasets from the WPD project file. */
        const datasets = _.transform(proj.datasetColl,
            (datasets, { name, data }) => {
                const guideMatch = GUIDE.exec(name);
                if (null != guideMatch) {
                    const [, guide, orderString] = guideMatch;
                    const order = parseFloat(orderString);
                    (datasets[guide] = datasets[guide] || []).push([order, _.map(data, "value")]);
                } else {
                    const scaleMatch = SCALE.exec(name);
                    if (null != scaleMatch) {
                        const [, scale, valueString] = scaleMatch;
                        const value = parseFloat(valueString);
                        (datasets[scale] = datasets[scale] || []).push([value, _.map(data, "value")]);
                    }
                }
            }, {} as Record<string, [number, Path][]>);

        /* Parse guides and scales from the chart definition file. */
        const guides = _.transform(_.entries(def.guides), (guides, [guide, { flow }]) => {
            if (!(guide in datasets)) {
                throw Error(`Guide dataset not found: ${guide}`);
            }
            const dataset = datasets[guide].sort(([v0], [v1]) => v0 - v1);
            const contours = _.transform(dataset, (acc, [value, path]) => {
                acc.push(normalizedPath(path, flow));
            }, [] as Path[]);
            console.log("contours", contours);
        }, [] as Guide[]);
        const scales = _.transform(_.entries(def.scales), (scales, [scale, { flow, unit, variable }]) => {
            if (!(scale in datasets)) {
                throw Error(`Scale dataset not found: ${scale}`);
            }
            const dataset = datasets[scale].sort(([v0], [v1]) => v0 - v1);
            const contours = _.transform(dataset, (acc, [value, path]) => {
                acc.push(normalizedPath(path, flow));
            }, [] as Path[]);
            console.log("contours", contours);
        }, [] as Guide[]);

        return freeze(new ChaseAroundChart([], {
            src: new URL(src.href),
            image: {
                src: new URL(def.image.src, src),
                size: def.image.size,
            },
        }), true);
    }
}

function normalizedPath(path: Path, flow: Direction) {
    const vert = "down" === flow || "up" === flow;
    const desc = "left" === flow || "up" === flow;
    return scaledPath(sortedPath(path, vert, desc), 4);
}

/**
 * Name pattern for a guide dataset.
 *
 * @private
 */
export const GUIDE = freeze(/^guide:([^=]+)@(0|(-?[1-9]\d*))$/, true);

/**
 * Name pattern for a guide dataset.
 *
 * @private
 */
export const SCALE = freeze(/^scale:([^=]+)=(0|(-?[1-9]\d*))$/, true);
