import ResultsStorage, { GameTypeScores, ScoreData } from './ResultsStorage';

const score30: ScoreData = {
    gameType: 'classic30',
    score: 30,
    wordCount: 30,
    totalTime: 243,
    date: 1697188862432
}
const score29_slow: ScoreData = {
    gameType: 'classic30',
    score: 29,
    wordCount: 30,
    totalTime: 244,
    date: 1697188862432
};
const score29_fast: ScoreData = {
    gameType: 'classic30',
    score: 29,
    wordCount: 30,
    totalTime: 243,
    date: 1697188862432
}
const score28: ScoreData =     {
    gameType: 'classic30',
    score: 28,
    wordCount: 30,
    totalTime: 236,
    date: 1697188862432
}
const score25: ScoreData = {
    gameType: 'classic30',
    score: 25,
    wordCount: 30,
    totalTime: 233,
    date: 1697188862432
};
const score24_old: ScoreData = {
    gameType: 'classic30',
    score: 24,
    wordCount: 30,
    totalTime: 232,
    date: 1697188862432
}
const score24_new: ScoreData = {
    gameType: 'classic30',
    score: 24,
    wordCount: 30,
    totalTime: 232,
    date: 1697188923234
}
const score23: ScoreData = {
    gameType: 'classic30',
    score: 23,
    wordCount: 30,
    totalTime: 232,
    date: 1697188862432
}
const score22: ScoreData = {
    gameType: 'classic30',
    score: 22,
    wordCount: 30,
    totalTime: 232,
    date: 1697188862432
};
const classic30Scores: ScoreData[] = [
    score29_fast,
    score28,
    score25,
    score24_old,
    score23
];
const wordSprintScores: ScoreData[] = [
    {
        gameType: 'wordSprint',
        score: 34,
        wordCount: 38,
        totalTime: 120,
        date: 1697188862432
    },
    {
        gameType: 'wordSprint',
        score: 29,
        wordCount: 32,
        totalTime: 120,
        date: 1697188862432
    }
];
const speedUpScores: ScoreData[] = [
    {
        gameType: 'speedUp',
        score: 34,
        wordCount: 38,
        totalTime: 178,
        date: 1697188862432
    },
    {
        gameType: 'speedUp',
        score: 29,
        wordCount: 32,
        totalTime: 167,
        date: 1697188862432
    }
];
const mockScoreData: GameTypeScores = {
    classic30: classic30Scores,
    wordSprint: wordSprintScores,
    speedUp: speedUpScores,
    classic10000: []
}

// Use the prototype to access private methods
const resultsStorageProto = Object.getPrototypeOf(ResultsStorage.getInstance());

describe('ResultsStorage', () => {

    describe('constructor', () => {
        it('should initialize the localStorage key with empty data', () => {
            const expectedData = {
                classic30: [],
                wordSprint: [],
                speedUp: [],
                classic10000: []
            };
            const actualData = resultsStorageProto.getData();
            expect(actualData).toEqual(expectedData);
        });
    })
    describe('non-constructor methods', () => {
        beforeEach(() => {
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(mockScoreData));
            jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });
        })
        describe('setScoreData', () => {
            it('should get and set the high score data in local storage', () => {
                // TODO: implement
            })
        });

        describe('getModifiedScoreDataForGameType', () => {
            it('should add the score data if there are no scores', () => {
                const expectedScores = [score30];
                const actualData = resultsStorageProto.getModifiedScoresForGameType(score30, []);
                expect(actualData.highScoresForGameType).toEqual(expectedScores);
            });
            it('should not add the score data if not in the top 5', () => {
                const actualData = resultsStorageProto
                    .getModifiedScoresForGameType(score22, classic30Scores);
                expect(actualData.highScoresForGameType).toEqual(classic30Scores);
                expect(actualData.newHighScoreIndex).toBeNull();
            })
            it('should add the score data if in the top 5', () => {
                const expectedScores = [
                    score30,
                    score29_fast,
                    score28,
                    score25,
                    score24_old
                ];
                const actualData = resultsStorageProto
                    .getModifiedScoresForGameType(score30, classic30Scores);
                expect(actualData.highScoresForGameType).toEqual(expectedScores);
                expect(actualData.newHighScoreIndex).toBe(0);
            })
            it('should take the lowest total time as better when two scores are the same with new score slower', () => {
                const oldScores: ScoreData[] = [
                    score29_fast,
                    score28,
                    score25,
                    score24_old,
                    score23
                ];
                const newScore = score29_slow;
                const expectedNewScores = [
                    score29_fast,
                    score29_slow,
                    score28,
                    score25,
                    score24_old
                ];

                const actualData = resultsStorageProto
                    .getModifiedScoresForGameType(newScore, oldScores);
                expect(actualData.highScoresForGameType).toEqual(expectedNewScores);
                expect(actualData.newHighScoreIndex).toBe(1);
            });
            it('should take the lowest total time as better when two scores are the same with new score faster', () => {
                const oldScores: ScoreData[] = [
                    score29_slow,
                    score28,
                    score25,
                    score24_old,
                    score23
                ];
                const newScore = score29_fast;
                const expectedNewScores = [
                    score29_fast,
                    score29_slow,
                    score28,
                    score25,
                    score24_old
                ];

                const actualData = resultsStorageProto
                    .getModifiedScoresForGameType(newScore, oldScores);
                expect(actualData.highScoresForGameType).toEqual(expectedNewScores);
                expect(actualData.newHighScoreIndex).toBe(0);
            });
            it('should take the oldest date as better when two scores and times are the same with new score newer', () => {
                const oldScores: ScoreData[] = [
                    score29_fast,
                    score28,
                    score25,
                    score24_old,
                    score23
                ];
                const newScore = score24_new;
                const expectedNewScores = [
                    score29_fast,
                    score28,
                    score25,
                    score24_old,
                    score24_new
                ];

                const actualData = resultsStorageProto
                    .getModifiedScoresForGameType(newScore, oldScores);
                expect(actualData.highScoresForGameType).toEqual(expectedNewScores);
                expect(actualData.newHighScoreIndex).toBe(4);
            });
            it('should take the oldest date as better when two scores and times are the same with new score older', () => {
                const oldScores: ScoreData[] = [
                    score29_fast,
                    score28,
                    score25,
                    score24_new,
                    score23
                ];
                const newScore = score24_old;
                const expectedNewScores = [
                    score29_fast,
                    score28,
                    score25,
                    score24_old,
                    score24_new
                ];

                const actualData = resultsStorageProto
                    .getModifiedScoresForGameType(newScore, oldScores);
                expect(actualData.highScoresForGameType).toEqual(expectedNewScores);
                expect(actualData.newHighScoreIndex).toBe(3);
            });
        })
    })
})
