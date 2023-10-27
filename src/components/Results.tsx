import styled from 'styled-components';
import { Page, useAppStore } from '../zstore';

const StyledResults = styled.div`
  background: rgba(87, 87, 178, 0.9);
  justify-content: center;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 48px;
  color: white;`;

const StyledHiScoresTable = styled.table`
  font-size: 25px;
  border: 1px solid white;
`;

const StyledTableRow = styled.tr`
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  &.newHighScore {
    background-color: #ff0101;
    color: #5ce518;
    font-weight: bold;
    animation: blinker 1s linear infinite;
    animation-iteration-count: 3;
  }
`;

const StyledTableCell = styled.td`
  padding: 30px;
`;

const StyledTryAgainButton = styled.button`
  background: #8dee81;
  color: #ff0000;
  font-size: 32px;
  padding: 20px;
  display: inline-block;
  border: 1px solid #ff0000;
  border-radius: 9px;
  margin-top: 20px;
`;

const Results = () => {
    const score = useAppStore((state) => state.score);
    const wordCount = useAppStore((state) => state.wordCount);
    const totalTime = useAppStore((state) => state.totalTime);
    const allScores = useAppStore((state) => state.allScores);
    const gameType = useAppStore((state) => state.gameType);
    const newHighScoreIndex = useAppStore((state) => state.newHighScoreIndex);
    const switchPage = useAppStore((state) => state.switchPage);
    const formattedTime = totalTime/1000;
    return (
        <>
            <StyledResults>
                <span>You scored {score}/{wordCount} in {formattedTime} seconds!</span>
                <StyledTryAgainButton onClick={() => switchPage(Page.PLAY, gameType)}>TRY AGAIN</StyledTryAgainButton>
                <>
                    <p>Hi scores for {gameType}</p>
                    <StyledHiScoresTable>
                        <thead>
                            <tr>
                                <th>Score</th>
                                <th>Word Count</th>
                                <th>Time</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allScores[gameType]?.length > 0 && allScores[gameType].map((score, index) => {
                                    return(
                                        <StyledTableRow
                                            className={`scoreRow ${newHighScoreIndex === index ? 'newHighScore' : ''}`}
                                            key={index}
                                        >
                                            <StyledTableCell>{score.score}</StyledTableCell>
                                            <StyledTableCell>{score.wordCount}</StyledTableCell>
                                            <StyledTableCell>{score.totalTime/1000} secs</StyledTableCell>
                                            <StyledTableCell>{new Date(score.date).toLocaleDateString("en-US")}</StyledTableCell>
                                        </StyledTableRow>);
                                })
                            }
                        </tbody>
                    </StyledHiScoresTable>
                </>
            </StyledResults>
        </>);
};

export default Results;
