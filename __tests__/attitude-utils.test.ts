import { quaternionToAttitude } from "../src/attitude-utils";

describe("attitude-utils.ts", () => {
    describe("quaternionToAttitude", () => {
        it("converts a sample quaternion", () => {
            const [roll, pitch, yaw] = quaternionToAttitude([0.6763963699, 0.7362237573, 0.0212442968, -0.003363966243]);
            expect(roll).toBeCloseTo(0.0267, 4);
            expect(pitch).toBeCloseTo(0.0337, 4);
            expect(yaw).toBeCloseTo(1.6559, 4);
        });
    });
});
