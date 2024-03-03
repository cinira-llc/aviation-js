import {Contour} from "../../../src/performance/chase-around/Contour";

describe("Contour", () => {
    describe("create()", () => {
        it("sorts and normalizes the path", () => {
            const contour = Contour.create([[1.23456, 1.23456], [2.34567, 2.34567]], "right");
            expect(contour.path).toEqual([[1.2346, 1.2346], [2.3457, 2.3457]]);
        });
    });
    describe("interpolate()", () => {
        it("returns the 'this' contour at factor 0", () => {
            const c0 = Contour.create([[1, 1], [2, 1]], "right");
            const c1 = Contour.create([[1, 2], [2, 2]], "right");
            expect(c0.interpolate(c1, 0)).toBe(c0);
        });
        it("returns the 'other' contour at factor 1", () => {
            const c0 = Contour.create([[1, 1], [2, 1]], "right");
            const c1 = Contour.create([[1, 2], [2, 2]], "right");
            expect(c0.interpolate(c1, 1)).toBe(c1);
        });
        it("returns interpolated contours between the given contours", () => {
            const c0 = Contour.create([[1, 1], [2, 1]], "right");
            const c1 = Contour.create([[1, 2], [2, 2]], "right");
            const i = c0.interpolate(c1, 0.25);
            expect(i.path).toEqual([[1, 1.25], [2, 1.25]]);
        });
        it("returns interpolated contours outside the given contours for negative factor", () => {
            const c0 = Contour.create([[1, 1], [2, 1]], "right");
            const c1 = Contour.create([[1, 2], [2, 2]], "right");
            const i = c0.interpolate(c1, -0.25);
            expect(i.path).toEqual([[1, 0.75], [2, 0.75]]);
        });
        it("returns interpolated contours outside the given contours for factor > 1", () => {
            const c0 = Contour.create([[1, 1], [2, 1]], "right");
            const c1 = Contour.create([[1, 2], [2, 2]], "right");
            const i = c0.interpolate(c1, 1.25);
            expect(i.path).toEqual([[1, 2.25], [2, 2.25]]);
        });
        it("also interpolates between vertical contours", () => {
            const c0 = Contour.create([[1, 1], [1, 2]], "down");
            const c1 = Contour.create([[2, 1], [2, 2]], "down");
            const i = c0.interpolate(c1, 1.75);
            expect(i.path).toEqual([[2.75, 1], [2.75, 2]]);
        });
    });
    describe("intersection()", () => {
        it("returns undefined if the contours do not intersect", () => {
            const c0 = Contour.create([[1, 1], [1, 2]], "right");
            const c1 = Contour.create([[2, 1], [2, 2]], "down");
            expect(c0.intersection(c1)).toBeUndefined();
        });
        it("returns intersecting points at the ends of the contours", () => {
            const c0 = Contour.create([[1, 1], [1, 2]], "right");
            const c1 = Contour.create([[1, 1], [2, 1]], "down");
            expect(c0.intersection(c1)).toEqual([1, 1]);
        });
        it("returns intersecting points along the contours", () => {
            const c0 = Contour.create([[2, 1], [1, 2]], "right");
            const c1 = Contour.create([[1, 1], [2, 2]], "down");
            expect(c0.intersection(c1)).toEqual([1.5, 1.5]);
        });
    });
    describe("split()", () => {
        describe("by path", () => {
            const c = Contour.create([[1, 1], [2, 1], [3, 1]], "right");
            it("splits at a point in the middle of the contour", () => {
                const i = Contour.create([[1.5, 0], [1.5, 2]], "down");
                const [c0, c1] = c.split(i);
                expect(c0.path).toEqual([[1, 1], [1.5, 1]]);
                expect(c1.path).toEqual([[1.5, 1], [2, 1], [3, 1]]);
            });
        });
        describe("by point", () => {
            const c = Contour.create([[1, 1], [2, 1], [3, 1]], "right");
            it("splits at an existing point in the middle of the contour", () => {
                const [c0, c1] = c.split([2, 1]);
                expect(c0.path).toEqual([[1, 1], [2, 1]]);
                expect(c1.path).toEqual([[2, 1], [3, 1]]);
            });
            it("splits at the start point of the contour", () => {
                const [c0, c1] = c.split([1, 1]);
                expect(c0.path).toEqual([[1, 1]]);
                expect(c1.path).toEqual([[1, 1], [2, 1], [3, 1]]);
            });
        });
    });
    describe("valueAt()", () => {
        const c = Contour.create([[1, 2], [2, 3], [3, 4]], "right");
        it("returns values at points on the contour", () => {
            expect(c.valueAt(1)).toBe(2);
            expect(c.valueAt(2)).toBe(3);
            expect(c.valueAt(3)).toBe(4);
        });
        it("interpolates values between points on the contour", () => {
            expect(c.valueAt(1.5)).toBe(2.5);
            expect(c.valueAt(2.75)).toBe(3.75);
        });
    });
});
