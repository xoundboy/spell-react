import { create } from 'zustand'
import { config } from './config';
import { log } from './logger';
import ResultsStorage, { GameTypeScores, ScoreData } from './models/ResultsStorage';
import Word, { WordData } from './models/Word';
import { wordList10000 } from './wordLists/commonWords10_000';
import { wordList3000 } from './wordLists/commonWords3000';

export enum Page {
    HOME = 'home',
    PLAY = 'play',
    RESULTS = 'results'
}

export enum GameType {
    CLASSIC_30 = 'classic30',
    WORD_SPRINT = 'wordSprint',
    SPEED_UP = 'speedUp',
    CLASSIC_10000 = 'classic10000'
}

interface AppState {
    currentPage: Page,
    gameType: GameType,
    wordData: WordData,
    focusedIndex: number,
    score: number,
    wordCount: number,
    enteredChars: string[],
    showCorrectAnswer: boolean,
    showNewWord: boolean,
    isCountingDown: boolean,
    countDownPercentage: number,
    startTime: number,
    totalTime: number,
    outOfTime: boolean,
    isGameOver: boolean,
    allScores: GameTypeScores,
    newHighScoreIndex: number | null,
    wordList: string[],
    switchPage: (newPage: Page, gameType?: GameType) => void,
    gameOver: () => void,
    newWord: () => void,
    submitWord: () => void,
    hideCorrectAnswerOverlay: () => void,
    pauseCountdown: () => void,
    updateCountdownPercentage: (percentage: number) => void,
    enterChar: (char: string) => void,
    deleteChar: () => void,
    focusNext: () => void,
    focusPrev: () => void,
    focusIndex: (index: number) => void,
}

export const useAppStore = create<AppState>()((set) =>
    ({
        currentPage: Page.HOME,
        gameType: GameType.CLASSIC_30,
        wordData: {} as WordData,
        focusedIndex: 0,
        score: 0,
        wordCount: 0,
        enteredChars: [],
        showCorrectAnswer: false,
        showNewWord: false,
        isCountingDown: false,
        countDownPercentage: 100,
        startTime: 0,
        totalTime: 0,
        outOfTime: false,
        isGameOver: false,
        allScores: {} as GameTypeScores,
        newHighScoreIndex: null,
        wordList: [],
        switchPage: (newPage: Page, gameType?: GameType) => set((state) => {
            log('switchPage', newPage)
            const newState = {...state};
            newState.currentPage = newPage;
            if(gameType) {
                newState.gameType = gameType;
            }

            switch(newPage) {
                case Page.PLAY:
                    switch (newState.gameType) {
                        case GameType.CLASSIC_30:
                            newState.isGameOver = false;
                            newState.score = 0;
                            newState.wordCount = 0;
                            newState.startTime = Date.now();
                            newState.wordList = wordList3000;
                            newState.showNewWord = true;
                            break;

                        case GameType.CLASSIC_10000:
                            newState.isGameOver = false;
                            newState.score = 0;
                            newState.wordCount = 0;
                            newState.startTime = Date.now();
                            newState.wordList = wordList10000;
                            newState.showNewWord = true;
                            break;
                        default:
                    }
                    break;

                default:
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
                totalTime: newState.totalTime,
                date: Date.now()
            };
            const result = ResultsStorage.getInstance().setScoreData(scoreData, state.gameType);
            newState.allScores = result.allScores
            newState.newHighScoreIndex = result.newHighScoreIndex
            newState.isGameOver = true;
            return newState;
        }),
        newWord: () => set((state) => {
            log('newWord')
            const newState = {...state};
            newState.outOfTime = false;
            newState.countDownPercentage = 100;
            newState.wordData = new Word(state.wordList).wordData;
            newState.enteredChars = [];
            newState.focusedIndex = 0;
            newState.isCountingDown = true;
            newState.showNewWord = false;
            newState.wordCount++;
            return newState;
        }),
        submitWord: () => set((state) => {
            log('submitWord')
            const newState = {...state};
            newState.isCountingDown = false;

            if (Word.validateEnteredChars(state.enteredChars, state.wordData, state.wordList)) {
                log('correct')
                newState.score++;
                if (state.wordCount === config.WORDS_PER_GAME) {
                    newState.isGameOver = true;
                } else {
                    newState.showNewWord = true;
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
            if (state.wordCount === config.WORDS_PER_GAME) {
                newState.isGameOver = true;
            } else {
                newState.showNewWord = true;
            }
            return newState;
        }),
        pauseCountdown: () => set(state => {
            log('pauseCountdown')
            const newState = {...state};
            newState.isCountingDown = false;
            return newState;
        }),
        updateCountdownPercentage: (percentageDelta: number) => set((state) => {
            // log('updateCountdownPercentage delta', percentageDelta)
            const newState = {...state};
            newState.countDownPercentage -= percentageDelta;
            if(state.countDownPercentage <= 0) {
                newState.outOfTime = true;
            }
            return newState;
        }),
        enterChar: (char: string) => set((state) => {
            log('enterChar', char)
            const newState = {...state};
            if (state.focusedIndex < state.wordData.removedChars?.length) {
                const newEnteredChars = [...state.enteredChars];
                newEnteredChars[state.focusedIndex] = char;
                newState.enteredChars = newEnteredChars;
                if (state.focusedIndex < state.wordData.removedChars?.length) {
                    newState.focusedIndex++;
                }
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
            if (state.focusedIndex > 0) {
                newState.focusedIndex--;
            }
            return newState;
        }),
        focusNext: () => set(
            (state) => {
                log('focusNext')
                const newState = {...state};
                if (state.focusedIndex < state.wordData.removedChars?.length) {
                    newState.focusedIndex++;
                }
                return newState;
            }
        ),
        focusPrev: () => set(
            (state)=> {
                log('focusPrev')
                const newState = {...state};
                if (state.focusedIndex > 0) {
                    newState.focusedIndex--;
                }
                return newState;
            }
        ),
        focusIndex: (newIndex: number) => set(
            (state): Partial<AppState> => {
                log('focusIndex', newIndex)
                const newState = {...state};
                newState.focusedIndex = newIndex
                return newState;
            }
        )
    })
)
