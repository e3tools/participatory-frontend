import * as Random from 'randomstring';

/**
 * Generate random string
 * See https://www.npmjs.com/package/randomstring
 * @param length
 * @returns
 */
export const generateRandomString = (length: number = 10) => {
    return Random.generate(length);
};

/**
 * Transform an object into a new object with new properties or a list of objects into a list of new objects
 * @param src Object from whom the new object will be derived
 * @param srcDestFieldMap src_field:dest_field dictionary
 */
export const transformObjectorArray = (
    src: object,
    srcDestFieldMap: Record<string, string>
) => {
    let srcArray;
    const isSrcArray = src instanceof Array;
    if (isSrcArray === false) {
        srcArray = [src];
    } else {
        srcArray = [...src];
    }
    const dstArray = [];
    srcArray.forEach((itm) => {
        let dst = {};
        if (Object.keys(srcDestFieldMap).length === 0) {
            // if there is no mapping provided, just copy the object
            dst = { ...itm };
        } else {
            for (const [key, value] of Object.entries(srcDestFieldMap)) {
                dst[value] = itm[key];
            }
        }
        dstArray.push(dst);
    });
    return isSrcArray ? dstArray : dstArray[0];
};

/**
 * Add leading characters to the value
 * @param val
 * @param padChars
 * @param length
 */
export const padStart = (
    val: string,
    padChars: string,
    length: number
): string => {
    return val.toString().padStart(length, padChars);
};

/**
 * Add trailing characters to the value
 * @param val
 * @param padChars
 * @param length
 */
export const padEnd = (
    val: string,
    padChars: string,
    length: number
): string => {
    return val.toString().padEnd(length, padChars);
};

/**
 * Update dict values. Similar to Python dict.update
 * @param src
 * @param dst
 */
export const updateDict = (src: object, dst: object): object => {
    if (!src) return dst;
    if (!dst) dst = {};
    for (let key in src) {
        dst[key] = src[key];
    }
    return dst;
};

/**
 * Clip text to the specified length
 * @param str
 * @param num
 */
export const clipText = (str: string, num: number) => {
    return str?.length > num ? str?.substring(0, num) + '...' : str;
};

/**
 * Construct db parameters based on query string values
 * @param queryString
 */
export const makeFilters = (queryString: Record<string, any>) => {
    const filters = [];
    for (const key in queryString) {
        filters.push([key, '=', queryString[key]]);
    }
    return filters;
};

/**
 * Convert File to base64
 * @param fileObj
 * @returns
 */
export const fileToBase64 = (fileObj: Blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.readAsDataURL(fileObj);
    });
};
