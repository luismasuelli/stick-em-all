import {useRef} from "react";


/**
 * Helper to make a function non-reactive.
 * @param f The function.
 * @returns {function(...[*]): *} The non-reactive wrapper.
 */
export function useNonReactive(f) {
    const ref = useRef(f);
    ref.current = f;
    ref.call ||= (...args) => ref.current(...args);
    return ref.call;
}