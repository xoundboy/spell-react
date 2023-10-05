import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { deleteChar, enterChar, newWord, tab, tabBack, submitWord } from '../playPageSlice';
// import logo from './logo.svg';
import Word, { wordData } from './Word';
import '../App.css';
import type { RootState } from '../store'
import { useSelector, useDispatch } from 'react-redux'

const StyledSubmitButton = styled.button`
  text-align: center;
  font-size: 40px;
  font-family: monospace, bold;
  border: 1px;
  border-radius: 9px;
  background-color: #444649;
  color: #777777;
  outline: rgb(124, 124, 124) 3px solid;
  margin: 20px auto;
  display: block; 

  &.focused {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    color: #ff9901;
  }
`;

function App() {
    const dispatch = useDispatch()
    const wordData = useSelector((state: RootState) => state.playPage.wordData)
    const focusedIndex = useSelector((state: RootState) => state.playPage.focusedIndex)
    const enteredChars = useSelector((state: RootState) => state.playPage.enteredChars)
    const wordCount = useSelector((state: RootState) => state.playPage.wordCount)
    const score = useSelector((state: RootState) => state.playPage.score)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (true) {

                case event.key === "Backspace":
                    dispatch(deleteChar());
                    break;

                case event.key === "Enter":
                    dispatch(submitWord());
                    break;

                case event.key === "Meta":
                case event.key === "Alt":
                case event.key === "Shift":
                    break;

                case event.key === "Tab":
                    event.preventDefault();
                    if (event.shiftKey) {
                        dispatch(tabBack())
                    } else {
                        dispatch(tab())
                    }
                    break;

                case !!event.key.match(/[a-z]/i) :
                    dispatch(enterChar(event.key));
                    break;

                default:
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div className="App">
            <div className="score">Score: {score}</div>
            <div className="wordCount">Word Count: {wordCount}</div>
            <Word
                wordWithUnderscores={wordData.wordWithUnderscores}
                focusedIndex={focusedIndex}
                enteredChars={enteredChars}
            />
            <StyledSubmitButton
                className={focusedIndex === wordData.removedChars.length ? "focused" : "" }
            >Submit</StyledSubmitButton>
        </div>
    );
}

export default App;
