import {freeze} from "immer";
import _, {Dictionary} from "lodash";
import classifyPoint from "robust-point-in-polygon";
import {scaledPath} from "@mattj65817/util-js";
import {Contour, Scale} from "../../charts";
import {WpdProject} from "../../web-plot-digitizer";

import type {Path} from "@mattj65817/util-js";
import type {UnitRange} from "../../performance/performance-types";
import type {WpdProjectJson} from "../chase-around/chase-around-types";
import type {Calculator} from "../calculator-types";
import type {LoadEnvelopeCalcJson, LoadEnvelopeCalculation} from "./load-envelope-types";

export class LoadEnvelopeCalculator implements Calculator {
    private constructor(
        private readonly scales: Dictionary<Scale>,
        private readonly areas: Area[],
        public readonly inputs: Dictionary<UnitRange>) {
    }

    /**
     * Category could be an output..?
     */
    readonly outputs = {};

    calculate(inputs: Dictionary<number>): LoadEnvelopeCalculation {
        const {areas, scales} = this;
        const contours = _.transform(_.entries(scales), (contours, [variable, scale]) => {
            contours.push(scale.at(inputs[variable]));
        }, [] as Contour[]);
        if (2 !== contours.length) {
            throw Error("Expected exactly two intersecting contours.");
        }
        const [first, second] = contours;
        const position = first.intersection(second);
        if (null == position) {
            throw Error("Expected contours to intersect.");
        }
        const match = areas.find(area => 1 !== classifyPoint(area.path, position));
        if (null == match) {
            return freeze({
                scales: [first.path, second.path],
                inputs: _.cloneDeep(inputs),
                outputs: {},
                solution: {
                    withinLimits: false,
                    position
                }
            }, true);
        }
        return freeze({
            scales: [first.split(position)[0].path, second.split(position)[0].path],
            inputs: _.cloneDeep(inputs),
            outputs: {},
            solution: {
                withinLimits: match.withinLimits,
                position: scaledPath(position, 4),
                ...(_.isString(match.category) ? {category: match.category} : {})
            }
        }, true);
    }

    /**
     * Create a {@link LoadEnvelopeCalculator} instance.
     *
     * @param def the calculator definition.
     * @param proj the WebPlotDigitizer project.
     */
    static create(def: LoadEnvelopeCalcJson, proj: WpdProjectJson) {
        const project = WpdProject.create(proj);
        const scales = _.transform(_.entries(def.scales), (scales, [name, scale]) => {
            scales[name] = project.scale(name, scale.variable || name, scale.unit, scale.flow);
        }, {} as Dictionary<Scale>);
        const areas = _.transform(def.areas, (areas, area) => {
            const name = area.area;
            areas.push({
                path: scaledPath(project.area(name), 4),
                ...area
            });
        }, [] as Area[]);
        const inputs = _.transform(scales,
            (inputs, {range, unit, variable}) => {
                inputs[variable] = {range, unit};
            }, {} as Dictionary<UnitRange>);
        return freeze(new LoadEnvelopeCalculator(scales, areas, inputs), true);
    }
}

type Area =
    & LoadEnvelopeCalcJson["areas"][number]
    & { path: Path };
