import {isLoadArmsJson, LoadArmsJson} from "./load-moment-types";
import {ArmUnit, WeightUnit} from "../../performance";
import _, {Dictionary} from "lodash";
import {freeze} from "immer";
import {Calculation, Calculator} from "../calculator-types";
import {AnyUnit} from "../../aviation-types";

export class LoadMomentCalculator implements Calculator {
    inputs: Dictionary<{ unit: AnyUnit; range?: [number, number] }>;
    outputs: Dictionary<{ unit: AnyUnit }>;

    private constructor(
        private readonly armUnit: ArmUnit,
        private readonly weightUnit: WeightUnit,
        private readonly arms: Dictionary<number>) {
        this.inputs = _.mapValues(arms, () => ({unit: weightUnit}));
        this.outputs = {
            centerOfGravity: {
                unit: armUnit
            },
            weight: {
                unit: weightUnit
            }
        }
    }

    calculate(inputs: Dictionary<number>): Calculation {
        const [weight, moment] = _.reduce(_.entries(this.arms),
            ([weight, moment], [name, arm]) => {
                const value = inputs[name] || 0;
                return [weight + value, moment + arm * value];
            }, [0, 0] as [weight: number, moment: number]);
        return freeze({
            inputs: _.cloneDeep(inputs),
            outputs: {
                centerOfGravity: 0 === weight ? 0 : (moment / weight),
                weight
            },
        }, true);
    }

    static create(def: LoadMomentJson) {
        if (isLoadArmsJson(def)) {
            const {arms, units: {arm, weight}} = def;
            return freeze(new LoadMomentCalculator(arm, weight, _.cloneDeep(arms)), true);
        }
        throw Error(`Unsupported definition file.`);
    }
}

type LoadMomentJson =
    | LoadArmsJson;