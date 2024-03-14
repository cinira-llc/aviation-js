import { freeze } from "immer";
import _ from "lodash";
import { cartesianToPolar, Path, Point, polarToCartesian } from "@mattj65817/util-js";
import { Flow } from "../Flows";
import { WpdProjectJson } from "./web-plot-digitizer-types";

/**
 * {@link WpdProject} holds the parsed contents of a WebPlotDigitizer project file and encapsulates the process of
 * parsing, sorting, and retrieving paths and values from the file.
 */
export class WpdProject {
    private constructor(private readonly datasets: Record<string, [number, Path][]>) {
    }

    /**
     * Get a path describing an *area*, which is a single closed polygon with no associated value.
     *
     * @param name the area name.
     */
    public area(name: string): Path {
        const [[, area]] = this.dataset(`area:${name}`);
        const mid: Point = [_.mean(_.map(area, 0)), _.mean(_.map(area, 1))];
        const path = polarToCartesian(_.sortBy(cartesianToPolar(area, mid), 1), mid);
        const [first] = path;
        if (!_.isEqual(first, _.last(path))) {
            path.push(first);
        }
        return path;
    }

    /**
     * Get the names of all areas in the project file.
     */
    public get areaNames() {
        return this.datasetNames("area");
    }

    /**
     * Get all paths describing a guide, with each path sorted according to a flow.
     *
     * @param name the guide name.
     * @param flow the guide flow.
     */
    public guide(name: string, flow: Flow): Path[] {
        return _.map(this.dataset(`guide:${name}`), 1).map(path => flow.sort(_.cloneDeep(path)));
    }

    /**
     * Get the names of all guides in the project file.
     */
    public get guideNames() {
        return this.datasetNames("guide");
    }

    /**
     * Get all paths describing a scale, with each path associated with a value and sorted according to a flow.
     *
     * @param name the scale name.
     * @param flow the scale flow.
     */
    public scale(name: string, flow: Flow): [value: number, path: Path][] {
        return _.map(this.dataset(`scale:${name}`), ([value, path]) => [value, flow.sort(_.cloneDeep(path))]);
    }

    /**
     * Get the names of all scales in the project file.
     */
    public get scaleNames() {
        return this.datasetNames("scale");
    }

    /**
     * Get the value(s) and path(s) for a dataset.
     *
     * @param name the dataset name.
     * @private
     */
    private dataset(name: string) {
        const { datasets: { [name]: dataset } } = this;
        if (null == dataset) {
            throw Error(`Dataset not found in project file: ${name}`);
        }
        return dataset;
    }

    /**
     * Get the names of all datasets of a given type in the project file.
     *
     * @param type the type.
     * @private
     */
    private datasetNames(type: "area" | "guide" | "scale") {
        return _.keys(this.datasets)
            .filter(name => name.startsWith(`${type}:`))
            .map(name => name.substring(type.length + 1))
            .sort();
    }

    /**
     * Create a {@link WpdProject} instance from the raw contents of a WebPlotDigitizer project file.
     *
     * @param proj the project file.
     */
    static create(proj: WpdProjectJson) {
        const datasets = _.transform(proj.datasetColl,
            (datasets, { name, data }) => {
                const areaMatch = AREA.exec(name);
                if (null != areaMatch) {
                    const [, area] = areaMatch;
                    const name = `area:${area}`;
                    (datasets[name] = datasets[name] || []).push([0, _.map(data, "value")]);
                } else {
                    const guideMatch = GUIDE.exec(name);
                    if (null != guideMatch) {
                        const [, guide, orderString] = guideMatch;
                        const order = parseFloat(orderString);
                        const name = `guide:${guide}`;
                        (datasets[name] = datasets[name] || []).push([order, _.map(data, "value")]);
                    } else {
                        const scaleMatch = SCALE.exec(name);
                        if (null != scaleMatch) {
                            const [, scale, valueString] = scaleMatch;
                            const value = parseFloat(valueString);
                            const name = `scale:${scale}`;
                            (datasets[name] = datasets[name] || []).push([value, _.map(data, "value")]);
                        }
                    }
                }
            }, {} as Record<string, [number, Path][]>);
        _.values(datasets).forEach(next => next.sort(([v0], [v1]) => v0 - v1));
        return freeze(new WpdProject(datasets), true);
    }
}

/**
 * Name pattern for an area dataset.
 *
 * @private
 */
const AREA = freeze(/^area:(.*)$/, true);

/**
 * Name pattern for a guide dataset.
 *
 * @private
 */
const GUIDE = freeze(/^guide:([^=]+)@(0|(-?[1-9]\d*))$/, true);

/**
 * Name pattern for a guide dataset.
 *
 * @private
 */
const SCALE = freeze(/^scale:([^=]+)=(0|(-?[1-9]\d*))$/, true);
