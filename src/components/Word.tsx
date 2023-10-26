import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { config } from '../config';
import { useAppStore } from '../zstore';
import CorrectAnswer from './CorrectAnswer';

const CharSpan = styled.span`
  color: #9b7e5f;
  font-size: 80px;
  font-family: monospace, bold;
`;

const CharInputField = styled.div`
  width: 55px;
  text-align: center;
  border: 1px;
  border-radius: 9px;
  color: #d97d01;
  font-size: 80px;
  font-family: monospace, bold;
  display: inline-block;

  &.focused {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    color: #ff9901;
  }
`;

const Word = () => {
    const focusedIndex = useAppStore(state => state.focusedIndex);
    const focusIndex = useAppStore(state => state.focusIndex);
    const wordData = useAppStore(state => state.wordData);
    const enteredChars = useAppStore((state) => state.enteredChars)
    const showCorrectAnswer = useAppStore((state) => state.showCorrectAnswer)
    const isCountingDown = useAppStore((state) => state.isCountingDown)
    const isGameOver = useAppStore((state) => state.isGameOver)
    const wordCount = useAppStore((state) => state.wordCount)
    const startCountdown = useAppStore((state) => state.startCountdown)
    const hideCorrectAnswerOverlay = useAppStore((state) => state.hideCorrectAnswerOverlay)
    const updateCountdownPercentage = useAppStore((state) => state.updateCountdownPercentage)
    const newWord = useAppStore((state) => state.newWord)
    const gameOver = useAppStore((state) => state.gameOver)

    const countdownIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        startCountdown()
    }, []);

    useEffect(() => {
        if (showCorrectAnswer)  {
            setTimeout(() => {
                hideCorrectAnswerOverlay()
            }, 1000);
        }
    }, [showCorrectAnswer]);

    useEffect(() => {
        if (isCountingDown)  {
            const percentageReductionPerSecond = 100 / config.INITIAL_COUNTDOWN_SECONDS;
            countdownIntervalRef.current = setInterval(() => {
                updateCountdownPercentage(percentageReductionPerSecond);
            }, 1000)
        } else {
            countdownIntervalRef.current && clearInterval(countdownIntervalRef.current);
        }
    }, [isCountingDown]);

    useEffect(() => {
        newWord();
    }, [wordCount]);

    useEffect(() => {
        if (isGameOver) {
            gameOver();
        }
    }, [isGameOver]);

    return (
        <>
            {showCorrectAnswer && <CorrectAnswer />}
            {wordData.wordWithUnderscores?.split('').map((char, index) => {
                if(char === "_" ) {
                    const currentBlankIndex = wordData.removedCharIndices.indexOf(index);
                    const className = `singleCharacter focusable ${focusedIndex 
                        === currentBlankIndex ? 'focused' : ''}`;
                    return <CharInputField
                        className={className}
                        key={index}
                        onClick={() => focusIndex(currentBlankIndex)}
                    >{enteredChars[currentBlankIndex] || "_"}</CharInputField>
                } else {
                    return <CharSpan key={index}>{char}</CharSpan>
                }
            })}
        </>
    );
};

export default Word;
