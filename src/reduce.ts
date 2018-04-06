import { FilterConstraint }     from './interface';
import { constraintHas as has } from './subtractConstraint';
import { passesContraint }      from './passes';

export function reduceConstraint(constraint: FilterConstraint): FilterConstraint {
    let reduced: FilterConstraint = { ...constraint };

    if (has(reduced, '$in')) {
        return {
            $in: reduced.$in!.filter(val => {
                const { $in, ...partialConstraint } = reduced;
                return passesContraint(partialConstraint, val);
            })
        };
    }

    if (has(reduced, '$nin')) {
        reduced.$nin = reduced.$nin!.filter(val => {
            const { $nin, ...partialConstraint } = reduced;
            return passesContraint(partialConstraint, val);
        });
        if (reduced.$nin.length === 0) {
            delete reduced.$nin;
        }
    }

    if (has(reduced, '$lt') && has(reduced, '$lte')) {
        if (reduced.$lt <= reduced.$lte) {
            delete reduced.$lte;
        } else {
            delete reduced.$lt;
        }
    }

    if (has(reduced, '$gt') && has(reduced, '$gte')) {
        if (reduced.$gt >= reduced.$gte) {
            delete reduced.$gte;
        } else {
            delete reduced.$gt;
        }
    }

    return reduced;

}