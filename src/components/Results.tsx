import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { switchPage } from '../playPageSlice';
import { RootState } from '../store';

const StyledResults = styled.div`
  background: rgba(28, 28, 187, 0.9);
  justify-content: center;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 48px;
  color: white;`;

const Results = () => {
    const dispatch = useDispatch();
    const score = useSelector((state: RootState) => state.playPage.score);
    const wordCount = useSelector((state: RootState) => state.playPage.wordCount);
    const totalTime = useSelector((state: RootState) => state.playPage.totalTime);
    const formattedTime = Math.floor(totalTime/10)/100
    return (
        <>
            <StyledResults>
                <span>You scored {score}/{wordCount} in {formattedTime} seconds!</span>
                <button onClick={() => dispatch(switchPage('playClassic30'))}>Try again</button>
            </StyledResults>
        </>);
};

export default Results;
