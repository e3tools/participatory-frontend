import { padStart } from './common';

/**
 * Convert date to default format
 * @param dt
 * @returns formatted date string
 */
export const formatDate = (dt: Date): string => {
    if (!dt) return '';
    if (typeof dt == 'string') return dt;
    const _pad = (val, length = 2) => {
        return padStart(val, '0', length); //val.toString().padStart(length, 0);
    };
    let res = `${dt.getFullYear()}-${_pad(dt.getMonth() + 1)}-${_pad(
        dt.getDate()
    )}`;
    return res;
};

/**
 * Convert date to default format
 * @param dt
 * @returns formatted date string
 */
export const formatDateTime = (dt: Date | string): string => {
    if (!dt) return '';
    // if (typeof dt == 'string') return dt;
    if (typeof dt == 'string') {
        dt = new Date(dt);
    }
    if (dt instanceof Date) {
        const _pad = (val, length = 2) => {
            return padStart(val, '0', length); //val.toString().padStart(length, 0);
        };
        let res =
            `${dt.getFullYear()}-${_pad(dt.getMonth() + 1)}-${_pad(
                dt.getDate()
            )}` +
            ' ' +
            `${_pad(dt.getHours())}:${_pad(dt.getMinutes())}` +
            ':' +
            `${_pad(dt.getSeconds())}`;
        return res;
    }
    return '';
};

/**
 * Convert string to data
 * @param dt
 * @returns
 */
export const parseDate = (dt: string | Date): Date | undefined => {
    try {
        return new Date(Date.parse(dt.toString()));
    } catch {
        console.warn('Date conversion error: ', dt);
    }
    return undefined;
};

export const getDaysBetweenDates = (
    startDate: Date,
    endDate: Date
): number | undefined => {
    const start = parseDate(startDate.toString());
    const end = parseDate(endDate?.toString());
    if (!start || !end) {
        return undefined;
    }
    let diffTime = end.getTime() - start.getTime();
    let diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    return diffDays;
};
