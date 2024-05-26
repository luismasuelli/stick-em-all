import {useRef} from "react";


/**
 * Helper to make a function non-reactive.
 * @param f The function.
 * @returns {function(...[*]): *} The non-reactive wrapper.
 */
export function useNonReactive(f) {
    const ref = useRef(f);
    ref.current = f;
    return (...args) => ref.current(...args);
}