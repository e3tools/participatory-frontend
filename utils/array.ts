/**
 * Return unique elements that both arrays share in common
 * @param array1
 * @param array2
 * @returns
 */
export const arrayIntersection = (array1: Array<any>, array2: Array<any>) => {
    return [...new Set(array1.filter((x) => array2.includes(x)))];
};

/**
 * Return elements from array A that are not in the array B
 * @param array1
 * @param array2
 * @returns
 */
export const arrayDifference = (array1: Array<any>, array2: Array<any>) => {
    return array1.filter((x) => !array2.includes(x));
};

/**
 * Return elements that are in either of set but not in their intersection
 * @param array1
 * @param array2
 * @returns
 */
export const arraySymmetricalDifference = (
    array1: Array<any>,
    array2: Array<any>
) => {
    return array1
        .filter((x) => !array2.includes(x))
        .concat(array2.filter((x) => !array1.includes(x)));
};

/**
 * Return be all the elements from A, all from B
 * @param array1
 * @param array2
 * @returns
 */
export const arrayUnion = (
    array1: Array<any>,
    array2: Array<any>,
    unique: boolean = true
) => {
    if (unique) return [...new Set([...array1, ...array2])];
    return [...array1, ...array2];
};

/**
 * Sort an array of objects by a property
 * @param array
 * @param sortKey
 * @param sortDirection
 */
export const arraySort = (
    array: any[],
    sortKey: string,
    sortDirection: 'asc' | 'desc' = 'asc'
) => {
    if (!array || array.length == 0) {
        return;
    }
    // check if each element in the array has the key
    if (!array.every((obj) => sortKey in obj)) {
        console.error(
            `Some objects lack the ${sortKey} key. Array cannot be sorted`
        );
    }
    const keyType = typeof array[0][sortKey];
    switch (keyType) {
        case 'number':
        case 'bigint':
        case 'boolean':
            if (sortDirection == 'asc') {
                array.sort((a, b) => Number(a[sortKey]) - Number(b[sortKey]));
            } else {
                array.sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]));
            }
            break;

        case 'string':
            if (sortDirection == 'asc') {
                array.sort((a, b) =>
                    String(a[sortKey]).localeCompare(String(b[sortKey]), 'en', {
                        sensitivity: 'accent',
                    })
                );
            } else {
                array.sort((a, b) =>
                    String(b[sortKey]).localeCompare(String(a[sortKey]), 'en', {
                        sensitivity: 'accent',
                    })
                );
            }
            break;
    }
};

/**
 * Group an array of objects by a property
 * @param array
 * @param key
 */
export const arrayGroup = (array: any[], key: string) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        return result;
    }, {});
};
