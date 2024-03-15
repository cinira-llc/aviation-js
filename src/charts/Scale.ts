import { freeze } from "immer";
import _ from "lodash";
import { Contour } from "./Contour";
import { Flow, Flows } from "./Flows";
import { Guide } from "./Guide";

import type { AnyUnit } from "../aviation-types";
import type { Direction } from ".";

export class Scale extends Guide {
    private constructor(
        name: string,
        readonly variable: string,
        readonly unit: AnyUnit,
        readonly range: [number, number],
        contours: [number, Contour][],
        flow: Flow,
    ) {
        super(name, contours, flow);
    }

    static createScale(name: string, variable: string, unit: AnyUnit, contours: [number, Contour][], dir: Direction) {
        if (_.isEmpty(contours)) {
            throw Error("At least one contour is required.");
        }
        const values = _.map(contours, 0);
        return freeze(new Scale(name, variable, unit, [_.min(values)!, _.max(values)!], contours, Flows[dir]), true);
    }
}
