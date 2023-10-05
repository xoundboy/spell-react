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
    const [score, _setScore] = useState<number>(0);
    const [wordCount, _setWordCount] = useState<number>(0);

    const enteredChars = useRef<string[]>([]);
    const wordDataRef = useRef<wordData>(wordData);
    const focusedIndexRef = useRef(focusedIndex);
    const scoreRef = useRef(score);
    const wordCountRef = useRef(wordCount);

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
                            setFocusedIndex(focusedIndexRef.current - 1);
                        }
                    } else {
                        setFocusedIndex(focusedIndexRef.current + 1);
                    }
                    break;
                case !!event.key.match(/[a-z]/i) :
                    if (focusedIndexRef.current < wordData.removedChars.length) {
                        enteredChars.current[focusedIndexRef.current] = event.key;
                        setFocusedIndex(focusedIndexRef.current + 1);
                    }
                    break;
                default:
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const setWordData = (newWord: wordData) => {
        wordDataRef.current = newWord;
        _setWordData(newWord);
    }

    const setFocusedIndex = (newIndex: number) => {
        focusedIndexRef.current = newIndex;
        _setFocusedIndex(newIndex);
    }

    const setScore = (newScore: number) => {
        scoreRef.current = newScore;
        _setScore(newScore);
    }

    const setWordCount = (newWordCount: number) => {
        wordCountRef.current = newWordCount;
        _setWordCount(newWordCount);
    }

    const submitWord = () => {
        let isCorrect = true;
        enteredChars.current.forEach((char, index) => {
            if (char !== wordDataRef.current.removedChars[index].char) {
                isCorrect = false;
            }
        });

        setWordCount(wordCountRef.current + 1);
        if(isCorrect) {
            setScore(scoreRef.current + 1);
        } else {
            console.log('incorrect')
            console.log('word: ', wordDataRef.current.inputWord)
            console.log('entered chars: ', enteredChars.current)
            console.log('removed chars: ', wordDataRef.current.removedChars)
        }
        reset()
    }

    const reset = () => {
        setWordData(getNewWord());
        enteredChars.current = [];
        setFocusedIndex(0);
    }

    return (
        <div className="App">
            <div className="score">Score: {score}</div>
            <div className="wordCount">Word Count: {wordCount}</div>
            <Word
                wordWithUnderscores={wordData.wordWithUnderscores}
                focusedIndex={focusedIndex}
                enteredChars={enteredChars.current}
            />
            <StyledSubmitButton
                className={focusedIndexRef.current === wordData.removedChars.length ? "focused" : "" }
            >Submit</StyledSubmitButton>
        </div>
    );
}

export default App;
