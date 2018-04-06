import {
    FilterConstraint,
    FilterConstraintKey
}               from './interface';
import { UTIL } from './util';

export function constraintHas(constraint: FilterConstraint, key: FilterConstraintKey): boolean {
    return typeof constraint[key] !== 'undefined';
}

const mergeFunctionsMap: Record<FilterConstraintKey,
    (existsVal: any, add: any) => any> = {
    $in: (existsVal, add) => UTIL.intersectionArray(existsVal, add),
    $nin: (existsVal, add) => UTIL.mergeArraysUnique(existsVal, add),
    $gt: (existsVal, add) => UTIL.biggerVal(existsVal, add),
    $lt: (existsVal, add) => UTIL.smallerVal(existsVal, add),
    $gte: (existsVal, add) => UTIL.biggerVal(existsVal, add),
    $lte: (existsVal, add) => UTIL.smallerVal(existsVal, add)
};

/**
 * subtract
 *      one constraint (B [query already fetched])
 *      from the other (A [query about to fetch])
 *
 * MEANS: find the constraint, where an element (C) passes, if it fullfills A, but not B
 *
 * @param {FilterConstraint | undefined} constraintFrom
 * @param {FilterConstraint} subConstraint
 * @returns {FilterConstraint[]}
 */
export function subtractConstraint(constraintFrom: FilterConstraint | undefined,
                                   subConstraint: FilterConstraint): FilterConstraint[] {
    // A - B === A and not B
    return and(constraintFrom || {}, neg(subConstraint));
}

function and(constraintA: FilterConstraint, constraintB: FilterConstraint): FilterConstraint[] {
    return Object.keys(constraintB)
                 .map((key: FilterConstraintKey) => (
                     {
                         ...constraintA,
                         [key]: !constraintHas(constraintA, key)
                             ? constraintB[key]
                             : mergeFunctionsMap[key](constraintA[key], constraintB[key])
                     }
                 ));
}

const negationMap: Record<FilterConstraintKey, FilterConstraintKey> = {
    $in: '$nin',
    $nin: '$in',
    $lt: '$gte',
    $gt: '$lte',
    $lte: '$gt',
    $gte: '$lt'
};

function neg(constraint: FilterConstraint): FilterConstraint {
    let reversed: FilterConstraint = {};
    for (const key of Object.keys(constraint) as FilterConstraintKey[]) {
        reversed[negationMap[key]] = constraint[key];
    }
    return reversed;
}