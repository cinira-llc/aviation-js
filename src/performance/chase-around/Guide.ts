import { Contour } from "./Contour";
import { freeze } from "immer";

export class Guide {
    private constructor(readonly name: string, readonly contours: [number, Contour][]) {
    }

    static create(name: string, contours: [number, Contour][]) {
        return freeze(new Guide(name, contours), true);
    }
}