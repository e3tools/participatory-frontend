export const castBooleanFields = (data: any, booleanFields: any[]) => {
    booleanFields.map((field) => {
        const keys = Object.keys(data);
        console.log('Obj keys: ', field);
        if (keys.includes(field)) {
            data[field] = data[field] === 1 ? true : false;
        }
    });
    return data;
};
