import _ from "lodash";
import momentArmsJson from "./moment-arms-hotspot.json";
import momentArmsProjJson from "../../calculators/load-moment/moment-arms.wpd.json";
import {HotspotVisualization} from "../../../src/visualizations/hotspot";
import {VisualizationLoader} from "../../../src/visualizations";

async function fetchTestData<T>(src: string | URL): Promise<T> {
    const path = _.isString(src) ? src : src.pathname;
    switch (_.last(path.split("/"))) {
        case "moment-arms-hotspot.json":
            return Promise.resolve(momentArmsJson as T);
        case "moment-arms.wpd.json":
            return Promise.resolve(momentArmsProjJson as T);
        default:
            throw Error(`Unsupported source: ${src}`);
    }
}

describe("HotspotVisualization", () => {
    const loader = VisualizationLoader.create(fetchTestData);
    describe("create()", () => {
        it("calculates hotspots from the moment-arms visualization", async () => {
            const def = await loader.load(new URL("http://charts.com/moment-arms-hotspot.json"));
            const vis = HotspotVisualization.create(def);
            expect(vis.variables).toStrictEqual({arm: "meters aft of datum"});
            const hotspot = vis.hotspot({
                arm: 2.35
            });
            expect(hotspot).toBeDefined();
            expect(hotspot![0]).toBeCloseTo(281.9291, 4);
            expect(hotspot![1]).toBeCloseTo(404.6046, 4);
        });
    });
    describe("load()", () => {
        it("loads the moment-arms visualization", async () => {
            const def = await loader.load(new URL("http://charts.com/moment-arms-hotspot.json"));
            expect(def.kind).toBe("hotspot-visualization-def");
            expect(def.axes).toEqual([
                {
                    scale: "arm",
                    unit: "meters aft of datum"
                },
                {
                    guide: "axis"
                }
            ]);
            expect(def.project).toEqual({
                "guide:axis": [
                    [0, [
                        [26.494638069705093, 404.6045576407506],
                        [898.1233243967829, 404.60455764075044],
                    ]]],
                "scale:arm": [
                    [0, [
                        [26.4946380697047, 12.57372654155496],
                        [26.49463806970642, 404.60455764075107]
                    ]],
                    [1, [
                        [135.6166219839142, 12.57372654155496],
                        [135.6166219839142, 404.6045576407506]
                    ]],
                    [2.3, [
                        [276.6219839142095, 12.573726541554963],
                        [276.6219839142091, 404.60455764075056]
                    ]],
                    [2.63, [
                        [311.6487935656841, 12.57372654155496],
                        [311.64879356568366, 404.6045576407506],
                    ]],
                    [3.25, [
                        [379.45710455764066, 12.573726541554963],
                        [379.4571045576407, 404.6045576407504],
                    ]],
                    [3.65, [
                        [423.4651474530833, 12.573726541554965],
                        [423.46514745308315, 404.60455764075067]
                    ]],
                    [3.89, [
                        [451.5315013404824, 12.573726541554969],
                        [451.5315013404826, 404.6045576407506]
                    ]],
                    [4.32, [
                        [494.64142091152814, 12.573726541554963],
                        [494.6414209115281, 404.60455764075067]
                    ]],
                    [4.54, [
                        [521.5851206434315, 12.573726541554963],
                        [521.5851206434317, 404.60455764075056]
                    ]],
                ],
            });
        });
    });
});
