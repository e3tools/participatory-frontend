
export const arrayGroupBy = (array: object[], groupByKey: string) : object[] => {
    const keys: string[] = [];
    // get keys
    array.map((el: object) => {
        keys.push(el[groupByKey.toString()]);
    })
    // loop through the keys
    const data: object[] = [];
    keys.map((key) => {
        const matching = array.filter((el) => el[groupByKey] == key);
        data.push({ [key]: matching || []})
    })
    return data;
}