import { Filter }             from './interface';
import {
    EFullfillable,
    fullfillable,
    fullfillableConstraint
}                             from './fullfillable';
import { subtractConstraint } from './subtractConstraint';
import { reduceConstraint }   from './reduce';

/**
 * subtract one filter (query already fetched)
 * from one new filter (query about to be fetched)
 *
 * @param {Filter} filterFrom
 * @param {Filter} subFilter
 * @returns {Filter[]}
 */
function subtractOne(filterFrom: Filter,
                     subFilter: Filter): Filter[] {

    // iterate filter fields

    /**
     * every field is independent
     *
     * filterFrom MINUS subFilter
     *  MEANS: apply filterFrom where AT LEAST one constraint of subFilter is not fullfilled
     *  E.G.:
     *  filterFrom: { f1: { $in: [1] } }
     *  subFilter: { f2: { $in: [2] }, f3: { $in: [3] } }
     *
     *  RESULT:
     *      f1          AND  \/ NOT f2           OR  f1          AND  \/ NOT f3
     *  [ { f1: { $in: [1] } f2: { $nin: [2] } } , { f1: { $in: [1] } f3: { $nin: [2] } } ]
     */
    return Object.keys(subFilter)
                 .map((subFilterKey) =>
                          // subtract new from existing constraint at field
                          subtractConstraint(filterFrom[subFilterKey], subFilter[subFilterKey])
                          // reduce previous to fullfillability-check
                              .map((constraint) => reduceConstraint(constraint))
                              // filter constraint, if it is not fullfillable anymore
                              .filter((constraint) => fullfillableConstraint(constraint) !== EFullfillable.eNever)
                              // merge with existing filter
                              .map((constraint) => (
                                  {
                                      ...filterFrom,
                                      [subFilterKey]: constraint
                                  }
                              )))
                 // reduce one array-level
                 .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
                 .filter(filter => fullfillable(filter) !== EFullfillable.eNever);
}

/**
 * subtract one or more filters (query already fetched)
 * from one new filter (query about to be fetched)
 *
 * @param {Filter} filterFrom
 * @param {Filter | Filter[]} subFilters
 * @returns {Filter[]}
 */
export function subtract(filterFrom: Filter, subFilters: Filter | Filter[]): Filter[] {

    let leftFilters: Filter[] = [filterFrom];

    if (!Array.isArray(subFilters)) {
        subFilters = [subFilters];
    }

    // iterate subFilters
    for (const subFilter of subFilters) {
        // remove the subFilter from all left filters (itself resulting in 0...n filters)
        leftFilters = leftFilters.map(leftFilter => subtractOne(leftFilter, subFilter))
                                 .reduce((previousValue, currentValue) => previousValue.concat(currentValue), []);

    }
    return leftFilters;

}