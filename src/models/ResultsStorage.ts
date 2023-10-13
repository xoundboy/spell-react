import { config } from '../config';
import { GameType } from '../playPageSlice';

interface IScoreData {
    gameType: GameType;
    score: number;
    wordCount: number;
    totalTime: number;
    date: number;
}

export class ScoreData implements IScoreData {
    gameType: GameType;
    score: number;
    wordCount: number;
    totalTime: number;
    date: number;
    constructor(gameType: GameType, score: number, wordCount: number, totalTime: number) {
        this.gameType = gameType;
        this.score = score;
        this.wordCount = wordCount;
        this.totalTime = totalTime;
        this.date = Date.now();
    }
}

export type GameTypeScores = Record<GameType, ScoreData[]>;

class ResultsStorage {

    storageKey: string = config.LOCAL_STORAGE_KEY;
    static instance: ResultsStorage;

    static getInstance() {
        if(!ResultsStorage.instance) {
            ResultsStorage.instance = new ResultsStorage();
        }
        return ResultsStorage.instance;
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
                speedUp: []
            }));
        }
    }

    getData(): GameTypeScores {
        const data = localStorage.getItem(this.storageKey);
        return JSON.parse(data!) as GameTypeScores;
    }

    getHighScoresByGameType(gameType: GameType): ScoreData[] {
        const data: GameTypeScores = this.getData()
        return data[gameType];
    }

    setScoreData(scoreData: ScoreData, gameType: GameType) {
        const allScores = this.getData();
        const gameTypeScores = this.getHighScoresByGameType(gameType);

        allScores[gameType] = this.getModifiedScoreDataForGameType(scoreData, gameTypeScores);
        localStorage.setItem(this.storageKey, JSON.stringify(allScores));
    }

    getModifiedScoreDataForGameType(scoreData: ScoreData, highScoresForGameType: ScoreData[]): ScoreData[] {
        if(highScoresForGameType.length === 0) {
            return [scoreData];
        }
        for (let i = 0; i < highScoresForGameType.length; i++) {
            if (scoreData.score > highScoresForGameType[i].score) {
                highScoresForGameType.splice(i, 0, scoreData);
                break;
            } else if (scoreData.score === highScoresForGameType[i].score) {
                if (scoreData.totalTime < highScoresForGameType[i].totalTime) {
                    highScoresForGameType.splice(i, 0, scoreData);
                    break;
                } else if (scoreData.totalTime === highScoresForGameType[i].totalTime) {
                    if (scoreData.date < highScoresForGameType[i].date) {
                        highScoresForGameType.splice(i, 0, scoreData);
                        break;
                    }
                }
            }
        }
        if(highScoresForGameType.length > config.MAX_HIGH_SCORES) {
            highScoresForGameType.pop();
        }
        return highScoresForGameType;
    }
}

export default ResultsStorage;
