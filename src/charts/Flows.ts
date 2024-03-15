import {Direction} from ".";
import {Path, Point, sortedPath} from "@mattj65817/util-js";
import {freeze} from "immer";

/**
 * {@link Flow} defines operations that vary according to the axial flow of a guide or contour.
 */
export interface Flow {
    /**
     * Flow direction.
     */
    dir: Direction;

    /**
     * Flag indicating whether the flow is vertical, default is horizontal.
     */
    vertical: boolean;

    /**
     * Get a point with the *position* and *value* in the appropriate coordinate.
     *
     * @param pos the position, major axis coordinate.
     * @param value the value, minor axis coordinate.
     */
    point(pos: number, value: number): Point;

    /**
     * Get the *position* (on the major axis) of a given point.
     *
     * @param pt the point.
     */
    position(pt: Point): number;

    /**
     * Get the *value* (coordinate on the minor axis) of a given point.
     *
     * @param pt the point.
     */
    value(pt: Point): number;

    /**
     * Sort a path on the appropriate coordinate and order.
     *
     * @param path the point;
     */
    sort(path: Path): Path;
}

/**
 * {@link Flow} instances keyed on the corresponding {@link Direction}.
 */
export const Flows = freeze<Record<Direction, Flow>>({
    down: {
        dir: "down",
        vertical: true,
        point: (pos, val) => [val, pos],
        position: pt => pt[1],
        value: pt => pt[0],
        sort: path => sortedPath(path, true)
    },
    left: {
        dir: "left",
        vertical: false,
        point: (pos, val) => [pos, val],
        position: pt => pt[0],
        value: pt => pt[1],
        sort: path => sortedPath(path, false, true)
    },
    right: {
        dir: "right",
        vertical: false,
        point: (pos, val) => [pos, val],
        position: pt => pt[0],
        value: pt => pt[1],
        sort: path => sortedPath(path)
    },
    up: {
        dir: "up",
        vertical: true,
        point: (pos, val) => [val, pos],
        position: pt => pt[1],
        value: pt => pt[0],
        sort: path => sortedPath(path, true, true)
    }
});
