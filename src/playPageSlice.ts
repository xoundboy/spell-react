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
        },
        enterChar: (state, action) => {
            if (state.focusedIndex < state.wordData.removedChars.length) {
                const newEnteredChars = [...state.enteredChars];
                newEnteredChars[state.focusedIndex] = action.payload;
                state.enteredChars = newEnteredChars;
                playPageSlice.caseReducers.focusNext(state)
            }
        },
        deleteChar: state => {
            if (state.focusedIndex === 0) {
                return
            }
            const newEnteredChars = [...state.enteredChars];
            newEnteredChars.splice(state.focusedIndex - 1, 1);
            state.enteredChars = newEnteredChars;
            playPageSlice.caseReducers.focusPrev(state)
        },
        tab: (state) => {
            if (state.focusedIndex < state.wordData.removedChars.length) {
                playPageSlice.caseReducers.focusNext(state)
            }
        },
        tabBack: (state) => {
            if (state.focusedIndex > 0) {
                playPageSlice.caseReducers.focusPrev(state)
            }
        },
        focusNext: state => {
            if (state.focusedIndex === state.wordData.removedChars.length) {
                return
            }
            state.focusedIndex++;
        },
        focusPrev: state => {
            if (state.focusedIndex === 0) {
                return
            }
            state.focusedIndex--;
        },
        submitWord: state => {
            state.wordCount++;

            let isCorrect = true;
            if (state.enteredChars.length !== state.wordData.removedChars.length) {
                isCorrect = false;
            }
            state.enteredChars.forEach((char, index) => {
                if (char !== state.wordData.removedChars[index].char) {
                    isCorrect = false;
                }
            });

            if(isCorrect) {
                state.score++
            }

            playPageSlice.caseReducers.newWord(state);
            state.enteredChars = [];
            state.focusedIndex = 0;
        },

    },
})

export const {
    newWord,
    enterChar,
    deleteChar,
    tab,
    tabBack,
    submitWord
} = playPageSlice.actions

export default playPageSlice.reducer
