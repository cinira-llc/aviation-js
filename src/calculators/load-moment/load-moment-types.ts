import _ from "lodash";
import {isArmUnit, isWeightUnit} from "../../performance";

import type {Dictionary} from "lodash";
import type {ArmUnit, WeightUnit} from "../../performance";

/**
 * Structure of a load-arms chart definition JSON file.
 */
export interface LoadArmsJson {
    kind: "load-arms";
    version: "1";
    units: {
        arm: ArmUnit;
        weight: WeightUnit;
    };
    arms: Dictionary<number>;
}

/**
 * Type guard for {@link LoadArmsJson}.
 *
 * @param val the value.
 */
export function isLoadArmsJson(val: unknown): val is LoadArmsJson {
    return _.isObject(val)
        && "arms" in val
        && "kind" in val
        && "units" in val
        && "version" in val
        && "load-arms" === val.kind
        && "1" === val.version
        && _.isObject(val.arms)
        && -1 === _.values(val.arms).findIndex(val => !_.isNumber(val))
        && _.isObject(val.units)
        && "arm" in val.units
        && "weight" in val.units
        && isArmUnit(val.units.arm)
        && isWeightUnit(val.units.weight);
}