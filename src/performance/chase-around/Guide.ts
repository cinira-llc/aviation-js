import {freeze} from "immer";
import _ from "lodash";
import {interpolateBy, sortedInterpolate} from "@mattj65817/util-js";
import {Contour} from "./Contour";

import {Flow, Flows} from "./Flows";
import type {Point} from "@mattj65817/util-js";
import {Direction} from "./chase-around-types";

export class Guide {
    protected constructor(
        readonly name: string,
        private readonly contours: [number, Contour][],
        private readonly flow: Flow
    ) {
    }

    /**
     * Get the contour at a given value, interpolating if necessary.
     *
     * @param value the value.
     */
    public at(value: number) {
        return sortedInterpolate(value, this.contours, (_v, f, c0, c1) => c0.interpolate(c1, f));
    }

    /**
     * Get the contour passing through a given point, interpolating if necessary.
     *
     * @param pt the point.
     */
    public through(pt: Point) {
        return this.valueAndContourThrough(pt)[1];
    }

    /**
     * Get the value at a given point.
     *
     * @param pt the point.
     */
    public value(pt: Point) {
        return this.valueAndContourThrough(pt)[0];
    }

    /**
     * Get the contour passing through a given point and the value associated with that contour, both of which will be
     * interpolated if the point does not fall directly on a defined contour.
     *
     * @param pt the point.
     * @private
     */
    private valueAndContourThrough(pt: Point): [number, Contour] {
        const {contours, flow} = this;
        const pos = flow.position(pt);
        return interpolateBy(flow.value(pt), contours, ([, c]) => c.valueAt(pos),
            (_v, f, [v0, c0], [v1, c1]) => [v0 + f * (v1 - v0), c0.interpolate(c1, f)]);
    }

    static createGuide(name: string, contours: [number, Contour][], dir: Direction) {
        return freeze(new Guide(name, _.cloneDeep(contours), Flows[dir]), true);
    }
}
