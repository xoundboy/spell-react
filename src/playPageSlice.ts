import { createSlice } from '@reduxjs/toolkit'
import { config } from './config';
import Word, { WordData } from './models/Word';

type CurrentPage = 'home' | 'playClassic30' | 'playWordSprint' | 'results' | 'settings' | 'highscores';

export interface PlayPageState {
    currentPage: CurrentPage,
    wordData: WordData,
    focusedIndex: number,
    score: number,
    wordCount: number,
    enteredChars: string[],
    showCorrectAnswer: boolean,
    isCountingDown: boolean,
    countDownPercentage: number,
    startTime: number,
    totalTime: number,
    isGameOver: boolean
}

const initialState: PlayPageState = {
    currentPage: 'home',
    wordData: new Word().wordData,
    focusedIndex: 0,
    score: 0,
    wordCount: 0,
    enteredChars: [],
    showCorrectAnswer: false,
    isCountingDown: false,
    countDownPercentage: 100,
    startTime: 0,
    totalTime: 0,
    isGameOver: false
}

export const playPageSlice = createSlice({
    name: 'playPage',
    initialState: initialState,
    reducers: {
        switchPage: (state, action) => {
            playPageSlice.caseReducers.resetCountdown(state);
            state.currentPage = action.payload;
            if (state.currentPage === 'playClassic30') {
                state.isGameOver = false;
                state.score = 0;
                state.wordCount = 0;
                state.startTime = Date.now();
                playPageSlice.caseReducers.hideCorrectAnswerOverlay(state);
            }
        },
        gameOver: (state) => {
            state.totalTime = Date.now() - state.startTime;
            state.isGameOver = true;
            playPageSlice.caseReducers.resetCountdown(state);
        },
        newWord: (state) => {
            if (state.currentPage === 'playClassic30' && state.wordCount === config.WORDS_PER_GAME){
                playPageSlice.caseReducers.gameOver(state);
                return;
            } else {
                state.wordData = new Word().wordData;
                state.enteredChars = [];
                state.focusedIndex = 0;
                playPageSlice.caseReducers.resetCountdown(state);
            }
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

            if (Word.validateEnteredChars(state.enteredChars, state.wordData)) {
                state.score++;
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
            state.isCountingDown = true;
        },
        updateCountdownPercentage: (state, action) => {
            state.countDownPercentage -= action.payload;
            if(state.countDownPercentage <= 0) {
                state.showCorrectAnswer = true;
            }
        },
        resetCountdown: state => {
            state.isCountingDown = false;
            state.countDownPercentage = 100;
        }
    },
})

export const {
    gameOver,
    switchPage,
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
