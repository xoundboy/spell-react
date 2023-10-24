import { create } from 'zustand'

interface FocusState {
    index: number,
    focusNext: () => void,
    focusPrev: () => void,
    focusIndex: (index: number) => void,
}

export const useFocusStore = create<FocusState>()((set) => ({
        index: 0,
        focusNext: () => set((state) => ({index: state.index + 1})),
        focusPrev: () => set((state) => ({ index: state.index - 1})),
        focusIndex: (newIndex: number) => set((): {index: number} => {
            // console.log('focusIndex', newIndex)
            return { index: newIndex }
        })
    })
)
