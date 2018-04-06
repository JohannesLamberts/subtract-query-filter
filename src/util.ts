export namespace UTIL {

    export function biggerVal(a: any, b: any): any {
        return a < b ? b : a;
    }

    export function smallerVal(a: any, b: any): any {
        return a > b ? b : a;
    }

    /**
     * intersectionArray([1, 2], [2, 3]): [2]
     * @param {any[]} arrFrom
     * @param {any[]} subArr
     * @returns {any[]} an array of all elements, that are contained in both arrays
     */
    export function intersectionArray(arrFrom: any[], subArr: any[]): any[] {
        return arrFrom.filter(val => subArr.indexOf(val) > -1);
    }

    /**
     * mergeArraysUnique([1, 2, 3], [2, 3, 4]): [1, 2, 3, 4]
     * @param {any[]} arrayOfArray
     * @returns {any[]} an array of all unique elements, that are contained in at least one array
     */
    export function mergeArraysUnique(...arrayOfArray: any[][]): any[] {
        return arrayOfArray
            .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
            .filter((val, index, arr) => arr.indexOf(val) === index);
    }
}