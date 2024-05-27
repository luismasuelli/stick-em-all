import {useCallback, useMemo} from "react";


/**
 * Generates a simple derived key.
 * @param state The base state.
 * @param setState The setState callback.
 * @param key The key.
 * @returns {(*|(function(*): *))[]} A pair (state, setState) for the derived state.
 */
export function useDerivedState(state, setState, key) {
    return [
        useMemo(() => state[key], [state, key]),
        useCallback(value => setState({
            ...state, ...(Object.fromEntries([[key, value]]))
        }), [setState, state, key])
    ]
}