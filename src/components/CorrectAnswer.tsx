import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 50vw;
    margin: 36px 25vw;
    height: 400px;
    background-color: #6c4d4d;
    border-radius: 20px;
    border: solid 5px red;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
const Wrong = styled.div`
    font-size: 40px;
    color: red;`

const Text = styled.div`
    color: goldenrod;`;

const Correction = styled.div`
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
  animation: blinker .25s linear infinite;
  font-size: 80px;
  font-family: monospace, bold;
  color: #049602;
`;

const CorrectAnswer = () => {
    const inputWord = useSelector((state: RootState) => state.playPage.wordData).inputWord
    return (
        <Overlay className="correct-answer">
            <Wrong>WRONG!</Wrong>
            {/*<Text>Correct Answer</Text>*/}
            <Correction>{inputWord}</Correction>
        </Overlay>
    );
}

export default CorrectAnswer;
