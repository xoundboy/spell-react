import styled from 'styled-components';
import { GameType, Page, useAppStore } from '../zstore';

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

const StyledH1 = styled.h1`
  margin: 0;
`;

const StyledH2 = styled.h2`
  font-size: 24px;
  margin: 0 0 50px;
`;

const Home = () => {
    const switchPage = useAppStore((state) => state.switchPage)
    return(
        <StyledMenuPage>
            <StyledH1>Spell It In!</StyledH1>
            <StyledH2>A Spelling Game</StyledH2>
            <StyledButton onClick={() => switchPage(Page.PLAY, GameType.CLASSIC_30)}>Classic 30</StyledButton>
            <StyledButton onClick={() => switchPage(Page.PLAY, GameType.CLASSIC_10000)}>Top ten thousand words</StyledButton>
            {/*<StyledButton onClick={() => dispatch(switchPage('playWordSprint'))}>Two min sprint</StyledButton>*/}
            {/*<StyledButton onClick={() => dispatch(switchPage('playSpeedUp'))}>Speed Up</StyledButton>*/}
        </StyledMenuPage>
    );
}
export default Home;
