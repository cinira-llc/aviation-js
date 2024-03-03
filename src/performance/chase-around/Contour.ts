import _ from "lodash";
import {freeze} from "immer";
import {intersection, pickAdjacentBy, scaledPath, sortedInterpolate, sortedPickAdjacent} from "@mattj65817/util-js";
import {Flows} from "./Flows";

import type {Path, Point} from "@mattj65817/util-js";
import type {Direction} from "./chase-around-types";
import type {Flow} from "./Flows";

/**
 * {@link Contour} describes a single path in a guide, typically a curve or a rule, and handles operations such as
 * determining intersections and interpolation.
 */
export class Contour {
    private readonly valuesByPosition: Path;

    private constructor(public readonly path: Path, private readonly flow: Flow) {
        if (flow.vertical) {
            this.valuesByPosition = _.map(path, ([x, y]) => [y, x]);
        } else {
            this.valuesByPosition = path;
        }
    }

    /**
     * Interpolate a contour based on the relative position of this and another.
     *
     * @param other the other contour.
     * @param factor the interpolation factor (`0.5` for the midpoint, for example.)
     */
    public interpolate(other: Contour, factor: number) {
        const {flow} = this;
        if (flow.dir !== other.flow.dir) {
            throw Error("Contours must have the same flow direction.");
        }
        if (0 === factor) {
            return this;
        } else if (1 === factor) {
            return other;
        }
        let lV: Path;
        let uV: Path;
        const {valuesByPosition: v} = this;
        const {valuesByPosition: oV} = other;
        if (v[0] < oV[0]) {
            lV = [...v];
            uV = [...oV];
        } else {
            lV = [...oV];
            uV = [...v];
        }
        const iV: Path = [];
        let overlap = false;
        while (0 !== lV.length && 0 !== uV.length) {
            const l = lV[0];
            const u = uV[0];
            const lPos = l[0];
            const uPos = u[0];
            if (!overlap) {
                if (lPos < uPos) {
                    lV.shift();
                    continue;
                }
                overlap = true;
            }

            /* Determine next position to add to the interpolated contour. */
            let pos: number;
            if (lPos > uPos) {
                pos = uPos;
                uV.shift();
            } else {
                pos = lPos;
                lV.shift();
                if (lPos === uPos) {
                    uV.shift();
                }
            }

            /* Interpolate between values at the current position. */
            const tP = this.pointAt(pos);
            const oP = other.pointAt(pos);
            const v0 = flow.value(tP);
            iV.push(flow.point(pos, v0 + factor * (flow.value(oP) - v0)));
        }
        return freeze(Contour.create(scaledPath(iV, 4), flow.dir), true);
    }

    /**
     * Get the *first* point, if any, along this contour at which it intersects another.
     *
     * @param other the other contour.
     */
    public intersection(other: Contour): Point | undefined {
        const {flow: {vertical}, path} = this;
        if (vertical === other.flow.vertical) {
            throw Error("Contours cannot both be horizontal or vertical.");
        }
        return intersection(path, other.path);
    }

    /**
     * Split this contour at a given point, or at the point at which it intersects another.
     *
     * @param at the point or other contour.
     */
    public split(at: Contour | Point) {
        let pt: Point;
        if (!(at instanceof Contour)) {
            pt = at;
        } else {
            const point = this.intersection(at);
            if (null == point) {
                throw Error("Contours do not intersect.");
            }
            pt = point;
        }
        const {flow, path, valuesByPosition} = this;
        const pos = flow.position(pt);
        const [index, adjacent] = pickAdjacentBy(pos, valuesByPosition, v => v[0]);
        const {dir} = flow;
        if (pos === adjacent[0][0]) {
            return freeze([
                Contour.create(path.slice(0, index + 1), dir),
                Contour.create(path.slice(index), dir)
            ], true);
        }
        if (1 === adjacent.length) {
            throw Error("Point not on contour.");
        }
        const [[p0, v0], pa1] = adjacent;
        const factor = (pos - p0) / (pa1[0] - p0);
        const value = v0 + factor * (pa1[1] - v0);
        const point = flow.point(pos, value);
        return [
            Contour.create([...path.slice(0, index + 1), point], dir),
            Contour.create([point, ...path.slice(index + 1)], dir),
        ];
    }

    /**
     * Get the value at a given position along the major axis.
     *
     * @param pos the position.
     */
    public valueAt(pos: number) {
        return this.flow.value(this.pointAt(pos));
    }

    /**
     * Get the point at a specific position in a path, interpolating if necessary.
     *
     * @param pos the position.
     */
    private pointAt(pos: number): Point {
        const {flow, valuesByPosition} = this;
        const value = sortedInterpolate(pos, valuesByPosition, (_p, factor, v0, v1) => v0 + factor * (v1 - v0));
        return flow.point(pos, value);
    }

    /**
     * Create a {@link Contour} instance.
     *
     * @param path the path.
     * @param dir the flow direction.
     */
    static create(path: Path, dir: Direction) {
        const flow = Flows[dir];
        const normalized = scaledPath(flow.sort(path), 4);
        return freeze(new Contour(normalized, flow), true);
    }
}
