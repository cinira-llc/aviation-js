import _ from "lodash";
import { freeze } from "immer";
import { Contour } from "./Contour";

import type { Path } from "@mattj65817/util-js";
import type { Chase, Solve } from "./chase-around-types";
import { Scale } from "./Scale";

export class CalcContext {
    private readonly path: Path = [];

    public readonly contours: Contour[] = [];

    public readonly open: Contour[] = [];

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

    public resolve(along: Contour) {
        const { open } = this;
        if (!_.isEmpty(open)) {
            const { contours, path } = this;
            const top = open.pop()!;

            /* ISS (maybe): https://github.com/mattj65817/aviation-js/issues/2 */
            if (!top.contains(along.path[0])) {
                contours.push(top);
                path.push(_.last(top.path)!);
            } else {
                const contour = top.split(along.path[0])[0];
                contours.push(contour);
                path.push(_.last(contour.path)!);
            }
        }
        return this;
    }

    public chase(step: Chase, along: Contour, advance: boolean) {
        const { contours, hasPosition, open, path } = this;
        if (hasPosition) {
            along = along.split(this.position)[1];
        }
        if (null == step.until) {
            open.push(along);
        } else {
            contours.push(along);
            if (advance) {
                path.push(_.last(along.path)!);
            }
        }
        return this;
    }

    public solve(step: Solve, scale: Scale) {
        const { contours, position } = this;
        contours.push(scale.through(position).split(position)[1]);
        this.set(scale.variable, scale.value(position));
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