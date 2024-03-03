import {freeze} from "immer";
import _ from "lodash";
import {Chase, GuideSpec, isChase, isGuideCondition, isSolve, Solve} from "./chase-around-types";
import {Contour} from "./Contour";
import {Guide} from "./Guide";
import {Scale} from "./Scale";

import type {Path} from "@mattj65817/util-js";
import type {ChartMetadata, UnitRange} from "../performance-types";
import type {ChaseAroundChartDef, Step, WpdProject} from "./chase-around-types";
import {CalcContext} from "./CalcContext";

/**
 * {@link ChaseAroundChart} makes performance calculations based on an aviation chase-around chart.
 */
export class ChaseAroundChart {
    private constructor(
        private readonly steps: Step[],
        private readonly guides: Record<string, Guide>,
        private readonly scales: Record<string, Scale>,
        private readonly inputs: Record<string, UnitRange>,
        private readonly outputs: Record<string, UnitRange>,
        public readonly meta: ChartMetadata
    ) {
    }

    calculate(inputs: Record<string, number>) {
        const missing = _.difference(_.keys(this.inputs), _.keys(inputs));
        if (!_.isEmpty(missing)) {
            throw Error(`Missing input variable(s): ${missing.sort().join(", ")}`);
        }
        return _.reduce(this.steps, (next, step) => {
            if (isChase(step)) {
                return this.doChase(next, step);
            } else if (isSolve(step)) {
                return this.doSolve(next, step);
            }
            throw Error("Unsupported step.");
        }, CalcContext.create(inputs));
    }

    /**
     * Evaluate a {@link Chase} step.
     *
     * @param context the calculation context.
     * @param step the step.
     * @private
     */
    private doChase(context: CalcContext, step: Chase) {
        const {advance, chase, until} = step;
        const along = this.resolveContour(context, chase);
        if (null == until) {
            return context.add(step, along, [along], false !== advance);
        }
        const limit = this.resolveContour(context, until);
        return context.add(step, along.split(limit)[0], [along, limit], false !== advance);
    }

    /**
     * Evaluate a {@link Solve} step.
     *
     * @param context the calculation context.
     * @param solve the step.
     * @private
     */
    private doSolve(context: CalcContext, {solve}: Solve) {
        const scale = this.scales[solve];
        const along = scale.through(context.position);
        return context.set(scale.variable, scale.value(_.last(along.path)!));
    }

    /**
     * Resolve a {@link GuideSpec} to a guide or scale.
     *
     * @param context the context.
     * @param guide the guide specification.
     * @private
     */
    private resolveContour(context: CalcContext, guide: GuideSpec) {
        let name: string;
        if (!isGuideCondition(guide)) {
            name = guide;
        } else {

            /* Evaluate a guide condition. */
            const {inputs} = context;
            const matches = _.flatMap(_.entries(guide), ([expr, guide]) => {
                const func = new Function("inputs", `with (inputs) { return !!(${expr}); }`);
                try {
                    if (func(inputs)) {
                        return [guide];
                    }
                } catch (ex) {
                    if (!(ex instanceof ReferenceError)) {
                        throw ex;
                    }
                }
                return [];
            });
            if (1 !== matches.length) {
                throw Error("Expected exactly one matching guide expression.");
            }
            name = matches[0];
        }

        /* Resolve the guide or scale to a contour. */
        const {guides, scales} = this;
        if (name in guides) {
            return guides[name].through(context.position);
        } else if (!(name in scales)) {
            throw Error(`Guide or scale not found: ${name}`);
        }
        const scale = scales[name];
        return scale.at(context.inputs[scale.variable]);
    }

    /**
     * Create a {@link ChaseAroundChart} from the raw contents of a chart definition file and its associated
     * WebPlotDigitizer project file.
     *
     * @param def the chart definition.
     * @param proj the WebPlotDigitizer project.
     * @param src the URL from which the chart definition was loaded.
     */
    static create(def: ChaseAroundChartDef, proj: WpdProject, src: URL) {

        /* Parse datasets from the WPD project file. */
        const datasets = _.transform(proj.datasetColl,
            (datasets, {name, data}) => {
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
        const guides = _.transform(_.entries(def.guides), (guides, [guide, {flow}]) => {
            if (!(guide in datasets)) {
                throw Error(`Guide dataset not found: ${guide}`);
            }
            const dataset = datasets[guide].sort(([v0], [v1]) => v0 - v1);
            const contours = _.transform(dataset,
                (acc, [order, path]) => {
                    acc.push([order, Contour.create(path, flow)]);
                }, [] as [number, Contour][]);
            guides[guide] = Guide.createGuide(guide, contours, flow);
        }, {} as Record<string, Guide>);
        const scales = _.transform(_.entries(def.scales), (scales, [scale, {flow, unit, variable}]) => {
            if (!(scale in datasets)) {
                throw Error(`Scale dataset not found: ${scale}`);
            }
            const dataset = datasets[scale].sort(([v0], [v1]) => v0 - v1);
            const contours = _.transform(dataset,
                (acc, [value, path]) => {
                    acc.push([value, Contour.create(path, flow)]);
                }, [] as [number, Contour][]);
            scales[scale] = Scale.createScale(scale, variable || scale, unit, contours, flow);
        }, {} as Record<string, Scale>);

        /* Determine inputs and outputs from steps and scales. */
        const {steps} = def;
        const solved = _.map(steps.filter(isSolve), "solve");
        const [inputs, outputs] = _.transform(scales,
            ([inputs, outputs], {range, unit, variable}) => {
                if (-1 !== solved.indexOf(variable)) {
                    outputs[variable] = {range, unit};
                } else {
                    inputs[variable] = {range, unit};
                }
            }, [{} as Record<string, UnitRange>, {} as Record<string, UnitRange>]);

        /* Add directional guides. */
        const {image: {size: [width, height]}} = def;
        const xMax = width - 1;
        const yMax = height - 1;
        _.assign(guides, {
            down: Guide.createGuide("down", [
                [0, Contour.create([[0, 0], [0, yMax]], "down")],
                [1, Contour.create([[xMax, 0], [xMax, yMax]], "down")]
            ], "up"),
            left: Guide.createGuide("left", [
                [0, Contour.create([[xMax, 0], [0, 0]], "left")],
                [1, Contour.create([[xMax, yMax], [0, yMax]], "left")]
            ], "up"),
            right: Guide.createGuide("right", [
                [0, Contour.create([[0, 0], [xMax, 0]], "right")],
                [1, Contour.create([[0, yMax], [xMax, yMax]], "right")]
            ], "up"),
            up: Guide.createGuide("up", [
                [0, Contour.create([[0, yMax], [0, 0]], "up")],
                [1, Contour.create([[xMax, yMax], [xMax, 0]], "up")]
            ], "up")
        });
        return freeze(new ChaseAroundChart(_.cloneDeep(steps), guides, scales, inputs, outputs, {
            src: new URL(src.href),
            image: {
                src: new URL(def.image.src, src),
                size: [width, height],
            },
        }), true);
    }
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
