import {ChaseAroundCalculator} from "./chase-around";

import type {CalculatorDef, Calculator} from "./performance-types";

/**
 * Create a performance calculator from a definition object.
 *
 * @param def the performance calculator definition.
 */
export function createCalculator(def: CalculatorDef): Calculator {
    switch (def.kind) {
        case "chase around":
            return ChaseAroundCalculator.create(def.definition, def.project);
    }
}