import { config } from '../config';
import { GameType } from '../playPageSlice';

export type ScoreData = {
    gameType: GameType;
    score: number;
    wordCount: number;
    totalTime: number;
    date: number;
}

export type GameTypeScores = Record<GameType, ScoreData[]>;

interface IResultsStorage {
    setScoreData: ( scoreData: ScoreData, gameType: GameType ) => { allScores: GameTypeScores, newHighScoreIndex: number | null },
}

class ResultsStorage implements IResultsStorage {

    private storageKey: string = config.LOCAL_STORAGE_KEY;
    private static instance: ResultsStorage;

    public static getInstance() {
        if(!ResultsStorage.instance) {
            ResultsStorage.instance = new ResultsStorage();
        }
        return ResultsStorage.instance;
    }

    public setScoreData(
        scoreData: ScoreData,
        gameType: GameType
    ): {
        allScores: GameTypeScores,
        newHighScoreIndex: number | null,
    } {
        const allScores = this.getData();
        const result = this.getModifiedScoresForGameType(scoreData, allScores[gameType]);
        allScores[gameType] = result.highScoresForGameType;
        localStorage.setItem(this.storageKey, JSON.stringify(allScores));
        return {
            allScores,
            newHighScoreIndex: result.newHighScoreIndex,
        };
    }

    private constructor() {
        this.init();
    }

    private init() {
        const data = localStorage.getItem(this.storageKey);
        if (!data) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                classic30: [],
                wordSprint: [],
                speedUp: [],
                classic10000: []
            }));
        }
    }

    private getData(): GameTypeScores {
        let data = localStorage.getItem(this.storageKey);
        if(!data) {
            // handle case where data is manually deleted from local storage by user
            this.init();
            data = localStorage.getItem(this.storageKey);
        }
        return JSON.parse(data!) as GameTypeScores;
    }

    private getModifiedScoresForGameType(
        scoreData: ScoreData,
        highScoresForGameType: ScoreData[]
    ): {
        highScoresForGameType:ScoreData[],
        newHighScoreIndex: number | null
    } {
        if(highScoresForGameType?.length === 0) {
            return {
                highScoresForGameType: [scoreData],
                newHighScoreIndex: 0
            };
        }
        let newHighScoreIndex = null;
        for (let i = 0; i < highScoresForGameType?.length; i++) {
            if (scoreData.score > highScoresForGameType[i].score) {
                highScoresForGameType.splice(i, 0, scoreData);
                newHighScoreIndex = i;
                break;
            } else if (scoreData.score === highScoresForGameType[i].score) {
                if (scoreData.totalTime < highScoresForGameType[i].totalTime) {
                    highScoresForGameType.splice(i, 0, scoreData);
                    newHighScoreIndex = i;
                    break;
                } else if (scoreData.totalTime === highScoresForGameType[i].totalTime) {
                    if (scoreData.date < highScoresForGameType[i].date) {
                        highScoresForGameType.splice(i, 0, scoreData);
                        newHighScoreIndex = i;
                        break;
                    }
                }
            }
        }
        if (highScoresForGameType?.length < config.MAX_HIGH_SCORES && newHighScoreIndex === null) {
            highScoresForGameType.splice(highScoresForGameType?.length, 0, scoreData);
            newHighScoreIndex = highScoresForGameType?.length - 1;
        }
        if (highScoresForGameType?.length > config.MAX_HIGH_SCORES) {
            highScoresForGameType.pop();
        }
        newHighScoreIndex = newHighScoreIndex !== null && newHighScoreIndex <= 4 ? newHighScoreIndex : null;
        return {
            highScoresForGameType,
            newHighScoreIndex
        };
    }
}

export default ResultsStorage;
