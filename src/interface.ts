export type FilterConstraint = {
    $in?: any[];
    $nin?: any[];
    $lt?: any;
    $gt?: any;
    $lte?: any;
    $gte?: any;
};

export type FilterConstraintKey = keyof FilterConstraint;

export interface Filter {
    [key: string]: FilterConstraint;
}