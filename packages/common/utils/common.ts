
/**
 * Group array by a property
 * Returns: an object of type [key1: [], key2: []] or as an object of type { key1: [], key2: [] }
 */
export const arrayGroupBy = (array: object[], groupByKey: string, transformFunction?: (obj: any)=>any, returnDict: boolean = false) : object[] | any[] => {
    const transform = (item: any) => {
        const val = item[groupByKey];
        const transformedVal = transformFunction ? transformFunction(val) : val;
        return transformedVal;
    }
    
    const keys: string[] = [];
    // get keys
    array.map((el: object) => {
        const ralVal = el[groupByKey];
        const val = transformFunction ? transformFunction(ralVal) : ralVal;
        keys.push(val.toString());
    })
    // loop through the unique keys
    const data: object[] = [];
    [...new Set(keys)].map((key) => {
        const matching = array.filter((el) => transform(el) == key);
        data.push({ [key]: matching || []})
    })
    if(returnDict){
        const res = {}
        for(const item of data) {
            // There is only one key for each element in the array. Rem array is of the form [key1: [], key2: []]
            const key = Object.keys(item)[0]; 
            const elements = item[key];
            res[key] = elements;  
        }
        return res;
    }
    return data;
}