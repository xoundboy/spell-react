import { createSlice } from '@reduxjs/toolkit'
import { wordData } from './components/Word';
import { getNewWord } from './utils/stringManipulations';

export interface PlayPageState {
    wordData: wordData,
    focusedIndex: number,
    score: number,
    wordCount: number,
    enteredChars: string[]
}

const initialState: PlayPageState = {
    wordData: getNewWord(),
    focusedIndex: 0,
    score: 0,
    wordCount: 0,
    enteredChars: []
}

export const playPageSlice = createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {
        newWord: (state) => {
            state.wordData = getNewWord();
            state.focusedIndex = 0;
            state.wordCount++;
        },
        enterChar: (state, action) => {

        },

        deleteChar: state => {

        }


        // initNewWord: (state) => {
        //     // Redux Toolkit allows us to write "mutating" logic in reducers. It
        //     // doesn't actually mutate the state because it uses the Immer library,
        //     // which detects changes to a "draft state" and produces a brand new
        //     // immutable state based off those changes.
        //     // Also, no return statement is required from these functions.
        //     state.wordData = getNewWord();
        // },
        // decrement: (state) => {
        //     state.value -= 1
        // },
        // incrementByAmount: (state, action) => {
        //     state.value += action.payload
        // },
    },
})

// Action creators are generated for each case reducer function
export const { newWord, enterChar, deleteChar } = playPageSlice.actions

export default playPageSlice.reducer
