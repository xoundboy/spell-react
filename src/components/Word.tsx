import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { config } from '../config';
import {
    gameOver,
    hideCorrectAnswerOverlay, newWord,
    startCountdown,
    updateCountdownPercentage
} from '../playPageSlice';
import { RootState } from '../store';
import { useFocusStore } from '../zstore';
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
    const dispatch = useDispatch();
    // const focusedIndex = useSelector((state: RootState) => state.playPage.focusedIndex)
    const focusedIndex = useFocusStore(state => state.index);
    const focusIndex = useFocusStore(state => state.focusIndex);
    const wordData = useSelector((state: RootState) => state.playPage.wordData)
    const enteredChars = useSelector((state: RootState) => state.playPage.enteredChars)
    const showCorrectAnswer = useSelector((state: RootState) => state.playPage.showCorrectAnswer)
    const isCountingDown = useSelector((state: RootState) => state.playPage.isCountingDown)
    const isGameOver = useSelector((state: RootState) => state.playPage.isGameOver)
    const wordCount = useSelector((state: RootState) => state.playPage.wordCount)

    const countdownIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        console.log('focusedIndex', focusedIndex)
    }, [focusedIndex]);

    useEffect(() => {
        dispatch(startCountdown())
    }, []);

    useEffect(() => {
        if (showCorrectAnswer)  {
            setTimeout(() => {
                dispatch(hideCorrectAnswerOverlay())
            }, 1000);
        }
    }, [showCorrectAnswer, dispatch]);

    useEffect(() => {
        if (isCountingDown)  {
            const percentageReductionPerSecond = 100 / config.INITIAL_COUNTDOWN_SECONDS;
            countdownIntervalRef.current = setInterval(() => {
                dispatch(updateCountdownPercentage(percentageReductionPerSecond));
            }, 1000)
        } else {
            countdownIntervalRef.current && clearInterval(countdownIntervalRef.current);
        }
    }, [isCountingDown, dispatch]);

    useEffect(() => {
        dispatch(newWord());
    }, [wordCount]);

    useEffect(() => {
        if (isGameOver) {
            dispatch(gameOver());
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
                        onClick={() => {
                            console.log('clicked', currentBlankIndex)
                            return focusIndex(currentBlankIndex)
                        }}
                    >{enteredChars[currentBlankIndex] || "_"}</CharInputField>
                } else {
                    return <CharSpan key={index}>{char}</CharSpan>
                }
            })}
        </>
    );
};

export default Word;
