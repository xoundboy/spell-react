import { create } from 'zustand'
import { config } from './config';
import { log } from './logger';
import ResultsStorage, { GameTypeScores, ScoreData } from './models/ResultsStorage';
import Word, { WordData } from './models/Word';
import { wordList10000 } from './wordLists/commonWords10_000';
import { wordList3000 } from './wordLists/commonWords3000';

export type CurrentPage = 'home' | 'playClassic30' | 'playClassic10000' | 'playWordSprint' | 'playSpeedUp' | 'results';

export enum GameType {
    CLASSIC_30 = 'classic30',
    WORD_SPRINT = 'wordSprint',
    SPEED_UP = 'speedUp',
    CLASSIC_10000 = 'classic10000'
}

interface AppState {
    currentPage: CurrentPage | GameType,
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
    wordList: string[],
    switchPage: (newPage: CurrentPage | GameType) => void,
    gameOver: () => void,
    newWord: () => void,
    submitWord: () => void,
    hideCorrectAnswerOverlay: () => void,
    startCountdown: () => void,
    pauseCountdown: () => void,
    updateCountdownPercentage: (percentage: number) => void,
    resetCountdown: () => void,
    enterChar: (char: string) => void,
    deleteChar: () => void,
    tab: () => void,
    tabBack: () => void,
    focusNext: () => void,
    focusPrev: () => void,
    focusIndex: (index: number) => void,
}

export const useAppStore = create<AppState>()((set, get) =>
    ({
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
        wordList: [],
        switchPage: (newPage: CurrentPage | GameType) => set((state) => {
            log('switchPage', newPage)
            const newState = {...state};
            newState.currentPage = newPage;

            switch(newPage as GameType) {
                case GameType.CLASSIC_30:
                    newState.isGameOver = false;
                    newState.score = 0;
                    newState.wordCount = 0;
                    newState.startTime = Date.now();
                    // playPageSlice.caseReducers.hideCorrectAnswerOverlay(state);
                    get().hideCorrectAnswerOverlay();
                    newState.gameType = GameType.CLASSIC_30;
                    newState.wordList = wordList3000;
                    break;

                case GameType.CLASSIC_10000:
                    state.isGameOver = false;
                    state.score = 0;
                    state.wordCount = 0;
                    state.startTime = Date.now();
                    // playPageSlice.caseReducers.hideCorrectAnswerOverlay(state);
                    get().hideCorrectAnswerOverlay();
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
            return newState;
        }),
        gameOver: () => set((state) => {
            log('gameOver')
            const newState = {...state};
            newState.totalTime = Date.now() - state.startTime;
            const scoreData: ScoreData = {
                gameType: state.gameType,
                score: state.score,
                wordCount: state.wordCount,
                totalTime: state.totalTime,
                date: Date.now()
            };
            const result = ResultsStorage.getInstance().setScoreData(scoreData, state.gameType);
            newState.allScores = result.allScores
            newState.newHighScoreIndex = result.newHighScoreIndex
            // playPageSlice.caseReducers.switchPage(state, { payload: 'results', type: '' })
            get().switchPage('results');
            return newState;
        }),
        newWord: () => set((state) => {
            log('newWord')
            log('state.wordCount', state.wordCount)
            const newState = {...state};
            get().resetCountdown();
            // playPageSlice.caseReducers.resetCountdown(state);
            newState.wordData = new Word(state.wordList).wordData;
            newState.enteredChars = [];
            newState.focusedIndex = 0;
            // playPageSlice.caseReducers.startCountdown(state);
            get().startCountdown();
            return newState;
        }),
        submitWord: () => set((state) => {
            log('submitWord')
            const newState = {...state};
            newState.isCountingDown = false;

            if (Word.validateEnteredChars(state.enteredChars, state.wordData, state.wordList)) {
                log('correct')
                newState.score++;
                if (state.wordCount < config.WORDS_PER_GAME) {
                    newState.wordCount++;
                } else {
                    newState.isGameOver = true;
                }

            } else {
                log('incorrect')
                newState.showCorrectAnswer = true;
            }
            return newState;
        }),
        hideCorrectAnswerOverlay: () => set((state) => {
            log('hideCorrectAnswerOverlay')
            const newState = {...state};
            newState.showCorrectAnswer = false;
            if (state.wordCount < config.WORDS_PER_GAME) {
                newState.wordCount++;
            } else {
                newState.isGameOver = true;
            }
            return newState;
        }),
        startCountdown: () => set(state => {
            log('startCountdown')
            const newState = {...state};
            newState.isCountingDown = true;
            return newState;
        }),
        pauseCountdown: () => set(state => {
            log('pauseCountdown')
            const newState = {...state};
            newState.isCountingDown = false;
            return newState;
        }),
        updateCountdownPercentage: (percentageDelta: number) => set((state) => {
            log('updateCountdownPercentage delta', percentageDelta)
            const newState = {...state};
            newState.countDownPercentage -= percentageDelta;
            if(state.countDownPercentage <= 0) {
                newState.showCorrectAnswer = true;
            }
            return newState;
        }),
        resetCountdown: () => set(state => {
            log('resetCountdown')
            const newState = {...state};
            newState.isCountingDown = false;
            newState.countDownPercentage = 100;
            return newState;
        }),
        enterChar: (char: string) => set((state) => {
            log('enterChar', char)
            const newState = {...state};
            if (state.focusedIndex < state.wordData.removedChars?.length) {
                const newEnteredChars = [...state.enteredChars];
                newEnteredChars[state.focusedIndex] = char;
                newState.enteredChars = newEnteredChars;
                get().focusNext();
                // playPageSlice.caseReducers.focusNext(state)
            }
            return newState;
        }),
        deleteChar: () => set(state => {
            log('deleteChar')
            const newState = {...state};
            if (state.focusedIndex === 0) {
                return state;
            }
            const newEnteredChars = [...state.enteredChars];
            newEnteredChars.splice(state.focusedIndex - 1, 1);
            newState.enteredChars = newEnteredChars;
            get().focusPrev();
            // playPageSlice.caseReducers.focusPrev(state)
            return newState;
        }),
        tab: () => set((state) => {
            if (state.focusedIndex < state.wordData.removedChars?.length) {
                get().focusNext();
                // playPageSlice.caseReducers.focusNext(state)
            }
            return state;
        }),
        tabBack: () => set((state) => {
            if (state.focusedIndex > 0) {
                get().focusPrev();
                // playPageSlice.caseReducers.focusPrev(state)
            }
            return state;
        }),
        focusNext: () => set(
            (state) => ({focusedIndex: state.focusedIndex + 1})
        ),
        focusPrev: () => set(
            (state)=> ({focusedIndex: state.focusedIndex - 1})
        ),
        focusIndex: (newIndex: number) => set(
            (): Partial<AppState> => ({focusedIndex: newIndex})
        )
    })
)
