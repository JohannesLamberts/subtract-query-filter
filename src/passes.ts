import {
    Filter,
    FilterConstraint
} from './interface';
import has = Reflect.has;

export function passesContraint(constraint: FilterConstraint, value: any): boolean {
    if (constraint.$in && constraint.$in.indexOf(value) === -1) {
        return false;
    }
    if (constraint.$nin && constraint.$nin.indexOf(value) !== -1) {
        return false;
    }
    if ((has(constraint, '$lt') && value >= constraint.$lt)) {
        return false;
    }
    if (has(constraint, '$lte') && value > constraint.$lte) {
        return false;
    }
    if (has(constraint, '$gt') && value <= constraint.$gt) {
        return false;
    }
    if ((has(constraint, '$gte') && value < constraint.$gte)) {
        return false;
    }
    return true;
}

export function passes(filter: Filter, obj: { [key: string]: any }): boolean {
    return Object.keys(filter).every(key => passesContraint(filter[key], obj[key]));
}