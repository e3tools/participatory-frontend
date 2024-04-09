import * as React from "react";

// See https://medium.com/@fitzmuzenda/create-refs-dynamically-in-react-ea2a4567b88
// See https://www.npmjs.com/package/use-dynamic-refs

const map = new Map<string, React.RefObject<unknown>>(); 

function set_ref<T>(key: string): React.RefObject<T> | void {
    if(!key) return console.warn(`useDynamicRefs: Cannot set ref without key`);
    const ref = React.createRef<T>();
    map.set(key, ref);
    return ref;
}

function get_ref<T>(key: string): React.RefObject<T> | undefined | void {
    if(!key) return console.warn(`useDynamicRefs: Cannot get ref without key`);
    return map.get(key) as React.RefObject<T>;
}

function useDynamicRefs<T>(): [
    (key: string) => void | React.RefObject<T>,
    (key: string) => void | React.RefObject<T>
] {
    return [get_ref, set_ref];
}

export default useDynamicRefs;