import createOriginal from 'zustand'
import * as zustand from 'zustand'

const createStateWrapper = (createState) => (set, get) => {
    const config = createState(set, get)
    return { setState: set, ...config }
}

// when creating a store, we get its initial state, create a reset function and add it in the set
export default function create(createState) {
    return createOriginal(createStateWrapper(createState))
}

export function createStore(createState) {
    return zustand.createStore(createStateWrapper(createState))
}

export { useStore } from 'zustand'
