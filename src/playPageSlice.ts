import { createSlice } from '@reduxjs/toolkit'
import { config } from './config';
import { log } from './logger';
import ResultsStorage, { ScoreData, GameTypeScores } from './models/ResultsStorage';
import Word, { WordData } from './models/Word';
import { wordList3000 } from './wordLists/commonWords3000';
import { wordList10000 } from './wordLists/commonWords10_000';

type CurrentPage = 'home' | 'playClassic30' | 'playClassic10000' | 'playWordSprint' | 'playSpeedUp' | 'results';
// export type GameType = 'classic30' | 'wordSprint' | 'speedUp' | 'classic10000';
export enum GameType {
    CLASSIC_30 = 'classic30',
    WORD_SPRINT = 'wordSprint',
    SPEED_UP = 'speedUp',
    CLASSIC_10000 = 'classic10000'
}

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
    isGameOver: boolean,
    allScores: GameTypeScores,
    newHighScoreIndex: number | null,
    wordList: string[]
}

const initialState: PlayPageState = {
    currentPage: 'home',
    gameType: GameType.CLASSIC_30,
    wordData: {} as WordData,
    focusedIndex: 0,
    score: 0,
    wordCount: 0,
    enteredChars: [],
    showCorrectAnswer: false,
    isCountingDown: false,
    countDownPercentage: 100,
    startTime: 0,
    totalTime: 0,
    isGameOver: false,
    allScores: {} as GameTypeScores,
    newHighScoreIndex: null,
    wordList: []
}

export const playPageSlice = createSlice({
    name: 'playPage',
    initialState: initialState,
    reducers: {
        switchPage: (state, action) => {
            log('switchPage', action.payload)
            state.currentPage = action.payload;

            switch(state.currentPage as GameType) {
                case GameType.CLASSIC_30:
                    state.isGameOver = false;
                    state.score = 0;
                    state.wordCount = 0;
                    state.startTime = Date.now();
                    playPageSlice.caseReducers.hideCorrectAnswerOverlay(state);
                    state.gameType = GameType.CLASSIC_30;
                    state.wordList = wordList3000;
                    break;

                case GameType.CLASSIC_10000:
                    state.isGameOver = false;
                    state.score = 0;
                    state.wordCount = 0;
                    state.startTime = Date.now();
                    playPageSlice.caseReducers.hideCorrectAnswerOverlay(state);
                    state.gameType = GameType.CLASSIC_10000;
                    state.wordList = wordList10000;
                    break;

                // case 'playWordSprint':
                //     state.gameType = 'wordSprint';
                //     // TODO: implement
                //     break;
                //
                // case 'playSpeedUp':
                //     state.gameType = 'speedUp';
                //     break;

                default:
                    // TODO: implement
            }
        },
        gameOver: (state) => {
            log('gameOver')
            state.totalTime = Date.now() - state.startTime;
            const scoreData: ScoreData = {
                gameType: state.gameType,
                score: state.score,
                wordCount: state.wordCount,
                totalTime: state.totalTime,
                date: Date.now()
            };
            const result = ResultsStorage.getInstance().setScoreData(scoreData, state.gameType);
            state.allScores = result.allScores
            state.newHighScoreIndex = result.newHighScoreIndex
            playPageSlice.caseReducers.switchPage(state, { payload: 'results', type: '' })
        },
        newWord: (state) => {
            log('newWord')
            log('state.wordCount', state.wordCount)

            playPageSlice.caseReducers.resetCountdown(state);
            state.wordData = new Word(state.wordList).wordData;
            state.enteredChars = [];
            state.focusedIndex = 0;
            playPageSlice.caseReducers.startCountdown(state);
        },
        submitWord: state => {
            log('submitWord')
            state.isCountingDown = false;

            if (Word.validateEnteredChars(state.enteredChars, state.wordData, state.wordList)) {
                log('correct')
                state.score++;
                if (state.wordCount < config.WORDS_PER_GAME) {
                    state.wordCount++;
                } else {
                    state.isGameOver = true;
                }

            } else {
                log('incorrect')
                state.showCorrectAnswer = true;
            }

        },
        hideCorrectAnswerOverlay: state => {
            log('hideCorrectAnswerOverlay')
            state.showCorrectAnswer = false;
            if (state.wordCount < config.WORDS_PER_GAME) {
                state.wordCount++;
            } else {
                state.isGameOver = true;
            }
        },
        startCountdown: state => {
            log('startCountdown')
            state.isCountingDown = true;
        },
        pauseCountdown: state => {
            log('pauseCountdown')
            state.isCountingDown = false;
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
    startCountdown,
    newWord,
    pauseCountdown
} = playPageSlice.actions

export default playPageSlice.reducer
