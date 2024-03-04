import _ from "lodash";
import { freeze } from "immer";
import { Step } from "./chase-around-types";
import { Contour } from "./Contour";
import { Path } from "@mattj65817/util-js";

export class CalcContext {
    private path: Path = [];
    public readonly steps: {
        step: Step;
        along: Contour;
        contours: Contour[];
    }[] = [];
    public outputs: Record<string, number> = {};

    private constructor(public readonly inputs: Record<string, number>) {
    }

    get hasPosition() {
        return !_.isEmpty(this.path);
    }

    get position() {
        const { path } = this;
        if (_.isEmpty(path)) {
            throw Error("Position not set.");
        }
        return _.last(path)!;
    }

    public add(step: Step, along: Contour, contours: Contour[], advance: boolean) {
        const { path, steps } = this;
        steps.push({ along, contours, step });
        if (advance) {
            path.push(_.last(along.path)!);
        }
        return this;
    }

    public set(variable: string, value: number) {
        this.outputs[variable] = value;
        return this;
    }

    static create(inputs: Record<string, number>) {
        return freeze(new CalcContext(_.cloneDeep(inputs)), true);
    }
}