import styled from 'styled-components';
import { useAppStore } from '../zstore';

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
    const word = useAppStore((state) => state.word)

    return (
        <Overlay className="correct-answer">
            <Wrong>{word.attemptedWord.length === word.inputWord.length ? `"${word.attemptedWord}" was ` : ''}WRONG!</Wrong>
            <Correction>{word.inputWord}</Correction>
        </Overlay>
    );
}

export default CorrectAnswer;
