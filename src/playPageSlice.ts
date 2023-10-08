import { createSlice } from '@reduxjs/toolkit'
import { getNewWord, wordData } from './utils/getNewWord';

export interface PlayPageState {
    wordData: wordData,
    focusedIndex: number,
    score: number,
    wordCount: number,
    enteredChars: string[],
    showCorrectAnswer: boolean,
    isCountingDown: boolean,
    countDownPercentage: number
}

const initialState: PlayPageState = {
    wordData: getNewWord(),
    focusedIndex: 0,
    score: 0,
    wordCount: 0,
    enteredChars: [],
    showCorrectAnswer: false,
    isCountingDown: false,
    countDownPercentage: 100
}

export const playPageSlice = createSlice({
    name: 'playPage',
    initialState: initialState,
    reducers: {
        newWord: (state) => {
            state.wordData = getNewWord();
            state.enteredChars = [];
            state.focusedIndex = 0;
            playPageSlice.caseReducers.resetCounter(state);
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
        focusIndex: (state, action) => {
            if (action.payload >= 0 && action.payload <= state.wordData.removedChars.length) {
                state.focusedIndex = action.payload;
            }
        },
        submitWord: state => {
            state.isCountingDown = false;
            state.wordCount++;
            let isCorrect = true;
            if (state.enteredChars.length !== state.wordData.removedChars.length) isCorrect = false;
            state.enteredChars.forEach((char, index) => {
                if (char !== state.wordData.removedChars[index].char) isCorrect = false;
            });
            if (isCorrect) {
                state.score++;
                // playPageSlice.caseReducers.resetCounter(state);
                playPageSlice.caseReducers.newWord(state);

            } else {
                state.showCorrectAnswer = true;
            }
        },
        hideCorrectAnswerOverlay: state => {
            state.showCorrectAnswer = false;
            playPageSlice.caseReducers.newWord(state);
        },
        startCountdown: state => {
            console.log('startCountdown')
            state.isCountingDown = true;
        },
        updateCountdownPercentage: (state, action) => {
            state.countDownPercentage -= action.payload;
            if(state.countDownPercentage <= 0) {
                state.showCorrectAnswer = true;
            }
        },
        resetCounter: state => {
            state.countDownPercentage = 100;
            state.isCountingDown = false;
        }
    },
})

export const {
    enterChar,
    deleteChar,
    tab,
    tabBack,
    submitWord,
    focusIndex,
    hideCorrectAnswerOverlay,
    updateCountdownPercentage,
    startCountdown
} = playPageSlice.actions

export default playPageSlice.reducer
