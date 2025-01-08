/**
 * Return unique elements that both arrays share in common
 * @param array1 
 * @param array2 
 * @returns 
 */
export const arrayIntersection = (array1: Array<any>, array2: Array<any>) => {
    return [...new Set(array1.filter(x => array2.includes(x)))]; 
}

/**
 * Return elements from array A that are not in the array B
 * @param array1 
 * @param array2 
 * @returns 
 */
export const arrayDifference = (array1: Array<any>, array2: Array<any>) => {
    return array1.filter(x => !array2.includes(x)); 
}

/**
 * Return elements that are in either of set but not in their intersection
 * @param array1 
 * @param array2 
 * @returns 
 */
export const arraySymmetricalDifference = (array1: Array<any>, array2: Array<any>) => {
    return array1.filter(x => !array2.includes(x))
                 .concat(array2.filter(x => !array1.includes(x)));
}

/**
 * Return be all the elements from A, all from B
 * @param array1 
 * @param array2 
 * @returns 
 */
export const arrayUnion = (array1: Array<any>, array2: Array<any>, unique:boolean = true) => {
    if(unique)
        return [...new Set([...array1, ...array2])];
    return [...array1, ...array2];
}
 