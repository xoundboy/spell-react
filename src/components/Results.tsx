import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { switchPage } from '../playPageSlice';
import { RootState } from '../store';

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
  }
`;

const StyledTableCell = styled.td`
padding: 30px;`;

const Results = () => {
    const dispatch = useDispatch();
    const score = useSelector((state: RootState) => state.playPage.score);
    const wordCount = useSelector((state: RootState) => state.playPage.wordCount);
    const totalTime = useSelector((state: RootState) => state.playPage.totalTime);
    const allScores = useSelector((state: RootState) => state.playPage.allScores);
    const gameType = useSelector((state: RootState) => state.playPage.gameType);
    const newHighScoreIndex = useSelector((state: RootState) => state.playPage.newHighScoreIndex);
    const formattedTime = totalTime/1000;
    return (
        <>
            <StyledResults>
                <span>You scored {score}/{wordCount} in {formattedTime} seconds!</span>
                <button onClick={() => dispatch(switchPage('playClassic30'))}>Try again</button>
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
