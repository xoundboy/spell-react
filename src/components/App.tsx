import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import logo from './logo.svg';
import Word, { wordData } from './Word';
import '../App.css';
import { getNewWord } from '../utils/stringManipulations';

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
    const [wordData, _setWordData] = useState<wordData>(getNewWord())
    const [focusedIndex, _setFocusedIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);
    const [enteredChars, _setEnteredChars] = useState<string[]>(new Array(wordData.removedChars.length).fill(''));

    const wordDataRef = useRef<wordData>(wordData);
    const focusedIndexRef = useRef<number>(focusedIndex);
    const enteredCharsRef = useRef<string[]>(enteredChars);

    const setWordData = (data: wordData) => {
        wordDataRef.current = data;
        _setWordData(data);
    }

    const setFocusedIndex = (data: number) => {
        focusedIndexRef.current = data;
        _setFocusedIndex(data);
    }

    const setEnteredChars = (data: string[]) => {
        enteredCharsRef.current = data;
        _setEnteredChars(data);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (true) {

                case event.key === "Backspace":
                    deleteChar();
                    break;

                case event.key === "Enter":
                    submitWord();
                    break;

                case event.key === "Meta":
                case event.key === "Alt":
                case event.key === "Shift":
                    break;

                case event.key === "Tab":
                    event.preventDefault();
                    if (event.shiftKey) {
                        if (focusedIndexRef.current > 0) {
                            focusPrev()
                        }
                    } else if (focusedIndexRef.current < wordData.removedChars.length) {
                        focusNext()
                    }
                    break;

                case !!event.key.match(/[a-z]/i) :
                    if (focusedIndexRef.current < wordData.removedChars.length) {
                        const newEnteredChars = [...enteredCharsRef.current];
                        newEnteredChars[focusedIndexRef.current] = event.key;
                        setEnteredChars(newEnteredChars);
                        focusNext()
                    }
                    break;

                default:
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    const deleteChar = () => {
        if (focusedIndexRef.current === 0) {
            return
        }
        const newEnteredChars = [...enteredCharsRef.current];
        newEnteredChars.splice(focusedIndexRef.current - 1, 1);
        setEnteredChars(newEnteredChars)
        focusPrev()
    }

    const focusNext = () => {
        setFocusedIndex(focusedIndexRef.current + 1);
    }

    const focusPrev = () => {
        setFocusedIndex(focusedIndexRef.current - 1);
    }

    const isCorrectInput = () => {
        let isCorrect = true;
        if (enteredCharsRef.current.length !== wordDataRef.current.removedChars.length) {
            isCorrect = false;
        }
        enteredCharsRef.current.forEach((char, index) => {
            if (char !== wordDataRef.current.removedChars[index].char) {
                isCorrect = false;
            }
        });
        return isCorrect;
    }

    const submitWord = () => {
        setWordCount(wordCount => wordCount + 1);
        if(isCorrectInput()) {
            setScore((score) => score + 1);
        }
        reset()
    }

    const reset = () => {
        setWordData(getNewWord());
        setEnteredChars([]);
        setFocusedIndex( 0);
    }

    return (
        <div className="App">
            <div className="score">Score: {score}</div>
            <div className="wordCount">Word Count: {wordCount}</div>
            <Word
                wordWithUnderscores={wordData.wordWithUnderscores}
                focusedIndex={focusedIndexRef.current}
                enteredChars={enteredChars}
            />
            <StyledSubmitButton
                className={focusedIndexRef.current === wordData.removedChars.length ? "focused" : "" }
            >Submit</StyledSubmitButton>
        </div>
    );
}

export default App;
