import { freeze } from "immer";
import _, { Dictionary } from "lodash";
import { isChase, isGuideCondition, isSolve } from "./chase-around-types";
import { ChaseAroundContext } from "./ChaseAroundContext";
import { Contour, Guide, Scale } from "../../charts";

import type {
    Chase,
    ChaseAroundCalcJson,
    ChaseAroundCalculation,
    GuideSpec,
    Solve,
    Step,
    WpdProjectJson,
} from "./chase-around-types";
import { Calculator } from "../calculator-types";
import { UnitRange } from "../../performance/performance-types";
import { WpdProject } from "../../web-plot-digitizer";

/**
 * {@link ChaseAroundCalculator} makes performance calculations based on an aviation chase-around chart.
 */
export class ChaseAroundCalculator implements Calculator {
    private constructor(
        private readonly steps: Step[],
        private readonly guides: Record<string, Guide>,
        private readonly scales: Record<string, Scale>,
        public readonly inputs: Record<string, UnitRange>,
        public readonly outputs: Record<string, UnitRange>,
    ) {
    }

    /**
     * Calculate output(s) from a given set of input(s).
     *
     * @param inputs the input variables.
     */
    calculate(inputs: Record<string, number>) {
        const missingInputs = _.difference(_.keys(this.inputs), _.keys(inputs));
        if (!_.isEmpty(missingInputs)) {
            throw Error(`Missing input variable(s): ${missingInputs.sort().join(", ")}`);
        }
        const result = _.reduce(this.steps, (context, step) => {
            if (isChase(step)) {
                return this.doChase(context, step);
            } else if (isSolve(step)) {
                return this.doSolve(context, step);
            }
            throw Error("Unsupported step.");
        }, ChaseAroundContext.create(inputs));
        const { outputs } = result;
        const missingOutputs = _.difference(_.keys(outputs), _.keys(this.outputs));
        if (!_.isEmpty(missingOutputs)) {
            throw Error(`Missing output variable(s): ${missingOutputs.sort().join(", ")}`);
        }
        return freeze<ChaseAroundCalculation>(_.cloneDeep({
            solution: _.map(result.solution, "path"),
            scales: _.map(result.scales, "path"),
            inputs,
            outputs,
        }), true);
    }

    /**
     * Evaluate a {@link Chase} step.
     *
     * @param context the current context.
     * @param step the step to evaluate.
     * @private
     */
    private doChase(context: ChaseAroundContext, step: Chase) {
        const { chase, until } = step;
        const contour = this.resolveContour(context, chase);
        if (null == until) {
            return context.chase(step, contour, []);
        } else {
            context = context.resolve(contour);
            const along = this.resolveContour(context, chase);
            const limit = this.resolveContour(context, until);
            return context.chase(step, along.split(limit)[0], [limit.split(along)[0]]);
        }
    }

    /**
     * Evaluate a {@link Solve} step.
     *
     * @param context the current context.
     * @param step the step to evaluate.
     * @private
     */
    private doSolve(context: ChaseAroundContext, step: Solve) {
        const { solve } = step;
        context = context.resolve(this.resolveContour(context, solve));
        return context.solve(this.scales[solve]);
    }

    private resolveContour(context: ChaseAroundContext, guide: GuideSpec) {
        let name: string;
        if (!isGuideCondition(guide)) {
            name = guide;
        } else {
            const { inputs } = context;
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
        const { guides, scales } = this;
        if (name in guides) {
            return guides[name].through(context.position);
        }
        if (!(name in scales)) {
            throw Error(`Guide or scale not found: ${name}`);
        }
        const scale = scales[name];
        return scale.at(context.inputs[scale.variable]);
    }

    /**
     * Create a {@link ChaseAroundCalculator} from the raw contents of a chart definition file and its associated
     * WebPlotDigitizer project file.
     *
     * @param def the chart definition.
     * @param proj the WebPlotDigitizer project.
     */
    static create(def: ChaseAroundCalcJson, proj: WpdProjectJson) {
        const project = WpdProject.create(proj);
        const guides = _.transform(_.entries(def.guides), (guides, [name, { flow }]) => {
            guides[name] = project.guide(name, flow);
        }, {} as Dictionary<Guide>);
        const scales = _.transform(_.entries(def.scales), (scales, [scale, { flow, unit, variable }]) => {
            scales[scale] = project.scale(scale, variable || scale, unit, flow);
        }, {} as Record<string, Scale>);

        /* Determine inputs and outputs from steps and scales. */
        const { steps } = def;
        const solved = _.map(steps.filter(isSolve), "solve");
        const [inputs, outputs] = _.transform(scales,
            ([inputs, outputs], { range, unit, variable }) => {
                if (-1 !== solved.indexOf(variable)) {
                    outputs[variable] = { range, unit };
                } else {
                    inputs[variable] = { range, unit };
                }
            }, [{} as Record<string, UnitRange>, {} as Record<string, UnitRange>]);

        /* Add directional guides. */
        const [xMax, yMax] = def.size;
        _.assign(guides, {
            down: Guide.createGuide("down", [
                [0, Contour.create([[0, 0], [0, yMax]], "down")],
                [1, Contour.create([[xMax, 0], [xMax, yMax]], "down")],
            ], "down"),
            left: Guide.createGuide("left", [
                [0, Contour.create([[xMax, 0], [0, 0]], "left")],
                [1, Contour.create([[xMax, yMax], [0, yMax]], "left")],
            ], "left"),
            right: Guide.createGuide("right", [
                [0, Contour.create([[0, 0], [xMax, 0]], "right")],
                [1, Contour.create([[0, yMax], [xMax, yMax]], "right")],
            ], "right"),
            up: Guide.createGuide("up", [
                [0, Contour.create([[0, yMax], [0, 0]], "up")],
                [1, Contour.create([[xMax, yMax], [xMax, 0]], "up")],
            ], "up"),
        });
        return freeze(new ChaseAroundCalculator(_.cloneDeep(steps), guides, scales, inputs, outputs), true);
    }
}
