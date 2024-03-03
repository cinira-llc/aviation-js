import {Contour} from "../../../src/performance/chase-around/Contour";
import {Guide} from "../../../src/performance/chase-around/Guide";

describe("Guide", () => {
    describe("at()", () => {
        const c0 = Contour.create([[1, 1], [10, 10]], "right");
        const c1 = Contour.create([[1, 11], [10, 21]], "right");
        const guide = Guide.create("test", [[1, c0], [10, c1]], "right");
        it("returns a contour whose value matches exactly", () => {
            expect(guide.at(1).path).toEqual([[1, 1], [10, 10]]);
            expect(guide.at(10).path).toEqual([[1, 11], [10, 21]]);
        });
        it("returns an interpolated guide between values", () => {
            expect(guide.at(5.5).path).toEqual([[1, 6], [10, 15.5]]);
        });
    });
    describe("through()", () => {
        const c0 = Contour.create([[1, 1], [10, 10]], "right");
        const c1 = Contour.create([[1, 11], [10, 21]], "right");
        const guide = Guide.create("test", [[1, c0], [10, c1]], "right");
        it("returns a contour which falls directly on the point", () => {
            expect(guide.through([1, 1]).path).toEqual([[1, 1], [10, 10]]);
            expect(guide.through([10, 21]).path).toEqual([[1, 11], [10, 21]]);
        });
    });
    describe("value()", () => {
        const c0 = Contour.create([[1, 1], [10, 10]], "right");
        const c1 = Contour.create([[1, 11], [10, 21]], "right");
        const guide = Guide.create("test", [[1, c0], [10, c1]], "right");
        it("returns the value associated with a point directly on a contour", () => {
            expect(guide.value([1, 1])).toBe(1);
            expect(guide.value([5, 5])).toBe(1);
            expect(guide.value([10, 21])).toBe(10);
        });
        it("returns an interpolated value for points between contours", () => {
            expect(guide.value([1, 5])).toBe(4.6);
        });
    });
});
