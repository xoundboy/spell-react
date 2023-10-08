import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { config } from '../config';
import { focusIndex, hideCorrectAnswerOverlay, startCountdown, updateCountdownPercentage } from '../playPageSlice';
import { RootState } from '../store';
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
    const wordWithUnderscores = useSelector((state: RootState) => state.playPage.wordData).wordWithUnderscores
    const focusedIndex = useSelector((state: RootState) => state.playPage.focusedIndex)
    const enteredChars = useSelector((state: RootState) => state.playPage.enteredChars)
    const showCorrectAnswer = useSelector((state: RootState) => state.playPage.showCorrectAnswer)
    const isCountingDown = useSelector((state: RootState) => state.playPage.isCountingDown)

    useEffect(() => {
        dispatch(startCountdown())
        console.log(isCountingDown)
    }, []);

    useEffect(() => {
        if (showCorrectAnswer)  {
            setTimeout(() => {
                dispatch(hideCorrectAnswerOverlay())
            }, 1000);
        }
    }, [showCorrectAnswer]);

    useEffect(() => {
        console.log('isCountingDown', isCountingDown)
        if (isCountingDown)  {
            const percentageReductionPerSecond = 100 / config.INITIAL_COUNTDOWN_SECONDS;
            setInterval(() => {
                console.log('update counter', percentageReductionPerSecond)
                dispatch(updateCountdownPercentage(percentageReductionPerSecond));
            }, 1000)
        }
    }, [isCountingDown]);

    let currentBlankIndex = -1;
    return (
        <>
            {showCorrectAnswer && <CorrectAnswer />}
            {wordWithUnderscores.split('').map((char, index) => {
                if(char === "_" ) {
                    currentBlankIndex++;
                    const className = `singleCharacter focusable ${focusedIndex === currentBlankIndex ? 'focused' : ''}`;
                    return <CharInputField
                        className={className}
                        key={index}
                        onClick={() => dispatch(focusIndex(currentBlankIndex))}
                    >{enteredChars[currentBlankIndex] || "_"}</CharInputField>
                } else {
                    return <CharSpan key={index}>{char}</CharSpan>
                }
            })}
        </>
    );
};

export default Word;
