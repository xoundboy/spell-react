import { createSlice } from '@reduxjs/toolkit'
import { config } from './config';
import { log } from './logger';
import ResultsStorage, { ScoreData } from './models/ResultsStorage';
import Word, { WordData } from './models/Word';

type CurrentPage = 'home' | 'playClassic30' | 'playWordSprint' | 'playSpeedUp' | 'results';
export type GameType = 'classic30' | 'wordSprint' | 'speedUp';

export interface PlayPageState {
    currentPage: CurrentPage,
    gameType: GameType,
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
    gameType: 'classic30',
    wordData: new Word().wordData,
    focusedIndex: 0,
    score: 0,
    wordCount: -1,
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
            log('switchPage', action.payload)
            playPageSlice.caseReducers.resetCountdown(state);
            state.currentPage = action.payload;

            switch(state.currentPage) {
                case 'playClassic30':
                    state.gameType = 'classic30';
                    state.isGameOver = false;
                    state.score = 0;
                    state.wordCount = 0;
                    state.startTime = Date.now();
                    playPageSlice.caseReducers.hideCorrectAnswerOverlay(state);
                    break;
                case 'playWordSprint':
                    state.gameType = 'wordSprint';
                    // TODO: implement
                    break;
                default:
                    state.gameType = 'speedUp';
                    // TODO: implement
            }
        },
        gameOver: (state) => {
            log('gameOver')
            state.totalTime = Date.now() - state.startTime;
            playPageSlice.caseReducers.resetCountdown(state);
            const scoreData = new ScoreData(
                state.gameType,
                state.score,
                state.wordCount,
                state.totalTime);
            console.log('ScoreData',scoreData)
            ResultsStorage.getInstance().setScoreData(scoreData, state.gameType);
            state.isGameOver = true;
        },
        newWord: (state) => {
            log('newWord')
            if (state.currentPage === 'playClassic30' && state.wordCount === (config.WORDS_PER_GAME)){
                playPageSlice.caseReducers.gameOver(state);
            } else {
                playPageSlice.caseReducers.resetCountdown(state);
                state.wordData = new Word().wordData;
                state.enteredChars = [];
                state.focusedIndex = 0;
                playPageSlice.caseReducers.startCountdown(state);
            }
            state.wordCount++;
        },
        submitWord: state => {
            log('submitWord')
            state.isCountingDown = false;

            if (Word.validateEnteredChars(state.enteredChars, state.wordData)) {
                log('correct')
                state.score++;
                playPageSlice.caseReducers.newWord(state);

            } else {
                log('incorrect')
                state.showCorrectAnswer = true;
            }
        },
        hideCorrectAnswerOverlay: state => {
            log('hideCorrectAnswerOverlay')
            state.showCorrectAnswer = false;
            playPageSlice.caseReducers.newWord(state);
        },
        startCountdown: state => {
            log('startCountdown')
            state.isCountingDown = true;
        },
        updateCountdownPercentage: (state, action) => {
            state.countDownPercentage -= action.payload;
            if(state.countDownPercentage <= 0) {
                state.showCorrectAnswer = true;
            }
        },
        resetCountdown: state => {
            log('resetCountdown')
            state.isCountingDown = false;
            state.countDownPercentage = 100;
        },
        enterChar: (state, action) => {
            log('enterChar', action.payload)
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
