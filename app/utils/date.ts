import { APP } from "./app";

/**
 * Convert date to default format
 * @param dt 
 * @returns formatted date string
 */
export const format_date = (dt: Date) : string => {
    if(!dt) return '';
    console.log("Formatting date: ", dt)
    if(typeof dt == 'string') return dt;
    const _pad = (val, length=2) => {
        return APP.pad_start(val, '0', length); //val.toString().padStart(length, 0);
      }
    let res = `${dt.getFullYear()}-${_pad(dt.getMonth() + 1)}-${_pad(dt.getDate())}`;
    return res
}

/**
 * Convert string to data
 * @param dt 
 * @returns 
 */
export const parse_date = (dt: string): Date => {
    try{
        return new Date(Date.parse(dt));
    } catch {
        console.warn('Date conversion error: ', dt);
    }
    return null;
}