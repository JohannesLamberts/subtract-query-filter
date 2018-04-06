import {
    Filter,
    FilterConstraint
}                               from './interface';
import { reduceConstraint }     from './reduce';
import { constraintHas as has } from './subtractConstraint';

export enum EFullfillable {
    eAlways,
    eDepends,
    eNever
}

export function fullfillableConstraint(constraint: FilterConstraint,
                                       isReduced: boolean = false): EFullfillable {

    const reduced = isReduced
        ? constraint
        : reduceConstraint(constraint);

    let fullfillableGuaranteed = true;

    if (typeof reduced.$in !== 'undefined') {
        if (reduced.$in.length === 0) {
            return EFullfillable.eNever;
        } else {
            fullfillableGuaranteed = false;
        }
    }

    if (typeof reduced.$nin !== 'undefined'
        && reduced.$nin.length !== 0) {
        fullfillableGuaranteed = false;
    }

    const hLt  = has(reduced, '$lt'),
          hGt  = has(reduced, '$gt'),
          hLte = has(reduced, '$lte'),
          hGte = has(reduced, '$gte');

    if (hLt || hLte || hGt || hGte) {
        fullfillableGuaranteed = false;
    }

    // reduced promises: NOT($lt AND $lte) AND NOT($gt AND $gte)
    if ((hLt || hLte) && (hGt || hGte)) {
        // both soft borders
        if (hLte && hGte) {
            if (reduced.$lte < reduced.$gte) {
                return EFullfillable.eNever;
            }
            // one hard border
        } else {
            if ((reduced.$lt || reduced.$lte) <= (reduced.$gt || reduced.$gte)) {
                return EFullfillable.eNever;
            }
        }
    }

    return fullfillableGuaranteed
        ? EFullfillable.eAlways
        : EFullfillable.eDepends;
}

export function fullfillable(filter: Filter): EFullfillable {

    let fullfillableGuaranteed = true;

    for (const key of Object.keys(filter)) {

        switch (fullfillableConstraint(filter[key])) {
            case EFullfillable.eNever:
                return EFullfillable.eNever;
            case EFullfillable.eDepends:
                fullfillableGuaranteed = false;
                break;
            default:
                break;
        }
    }

    return fullfillableGuaranteed
        ? EFullfillable.eAlways
        : EFullfillable.eDepends;
}