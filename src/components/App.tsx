import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { wordList } from '../commonWords';
// import logo from './logo.svg';
import Word, { wordData } from './Word';
import '../App.css';
import { prepareWord } from '../utils/stringManipulations';

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

const getNewWord = () => prepareWord(wordList[Math.floor(Math.random() * wordList.length)])

function App() {
    const [wordData, setWordData] = useState<wordData>(getNewWord())
    const enteredChars = useRef<string[]>([]);
    const [focusedIndex, _setFocusedIndex] = useState<number>(0);
    const focusedIndexRef = useRef(focusedIndex);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (true) {
                case event.key === "Backspace":
                    event.preventDefault();
                    if (focusedIndexRef.current === 0) return;
                    enteredChars.current[focusedIndexRef.current - 1] = "";
                    setFocusedIndex(focusedIndexRef.current - 1);
                    break;
                case event.key === "Enter":
                    // TODO submit the word
                    console.log("submitting")
                    break;
                case event.key === "Meta":
                case event.key === "Alt":
                case event.key === "Shift":
                    break;
                case event.key === "Tab":
                    event.preventDefault();
                    if (event.shiftKey) {
                        if (focusedIndexRef.current > 0) {
                            setFocusedIndex(focusedIndexRef.current - 1);
                        }
                    } else {
                        setFocusedIndex(focusedIndexRef.current + 1);
                    }
                    break;
                case (event.key.match(/[a-z]/i) && focusedIndexRef.current < wordData.wordWithUnderscores.length):
                    onCharInput(event.key, focusedIndexRef.current);
                    break;
                default:
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const setFocusedIndex = (newIndex: number) => {
        focusedIndexRef.current = newIndex;
        _setFocusedIndex(newIndex);
    }

    const onCharInput = (char: string, index: number) => {
        enteredChars.current[index] = char;
        setFocusedIndex(focusedIndexRef.current + 1);
    }

    return (
        <div className="App">
            <Word
                wordWithUnderscores={wordData.wordWithUnderscores}
                focusedIndex={focusedIndex}
                enteredChars={enteredChars.current}
            />
            <StyledSubmitButton
                className={focusedIndexRef.current === wordData.removedChars.length ? "focused" : "" }
                onClick={(event) =>{
                    console.log("submitting")
                }}
            >Submit</StyledSubmitButton>
        </div>
    );
}

export default App;
