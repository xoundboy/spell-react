import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { switchPage } from '../playPageSlice';


const StyledMenuPage = styled.div`
  background: rgba(33, 33, 134, 0.9);
    justify-content: center;
    text-align: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 48px;
    color: white;
`;

const StyledButton = styled.button`
  background: rgba(176, 176, 220, 0.9);
    border-radius: 10px;
    border: 2px solid rgba(33, 33, 134, 0.9);
    color: rgba(33, 33, 134, 0.9);
    margin: 0 1em;
    padding: 0.25em 1em;
    font-size: 24px;
    &:hover {
        background: rgba(33, 33, 134, 0.9);
        color: rgba(176, 176, 220, 0.9);
    }
`;

const Home = () => {
    const dispatch = useDispatch()
    return(
        <StyledMenuPage>
            <h1>Spell It In!</h1>
            <StyledButton onClick={() => dispatch(switchPage('playClassic30'))}>Classic 30</StyledButton>
            <StyledButton onClick={() => dispatch(switchPage('playWordSprint'))}>Two min sprint</StyledButton>
            <StyledButton onClick={() => dispatch(switchPage('playSpeedUp'))}>Speed Up</StyledButton>
        </StyledMenuPage>
    );
}
export default Home;