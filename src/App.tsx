import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { wordList } from './commonWords';
// import logo from './logo.svg';
import Word, { wordData } from './components/Word';
import './App.css';
import { prepareWord } from './utils/stringManipulations';

const StyledSubmitButton = styled.button`
  text-align: center;
  font-size: 40px;
  font-family: monospace, bold;
  border: 1px;
  border-radius: 9px;
  background-color: #444649;
  color: #777777;
  outline: rgb(124, 124, 124) 3px solid;
  margin: 20px 4px;

  &:focus {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    color: #ff9901;
  }
`;

const getNewWord = () => prepareWord(wordList[Math.floor(Math.random() * wordList.length)])


function App() {
    const removedCharRefs = useRef<Array<HTMLInputElement | undefined>>([]);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const [focusedIndex, _setFocusedIndex] = useState<number | null>(0);
    const [wordData, setWordData] = useState<wordData>(getNewWord());
    const focusedIndexRef = useRef(focusedIndex);

    const setFocusedIndex = (newIndex: number | null) => {
        focusedIndexRef.current = newIndex;
        _setFocusedIndex(newIndex);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Backspace") {
            if (!focusedIndexRef.current) {
                setFocusedIndex(removedCharRefs.current.length);
                return;
            }
            if (focusedIndexRef.current > 0) {
                console.log(focusedIndexRef.current)
            }
        }
    }

    useEffect(() => {
        removedCharRefs.current[0]?.focus();
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        removedCharRefs.current[focusedIndexRef.current]?.focus();
        console.log('new focus index',focusedIndex)
    }, [focusedIndex]);

    const onCharInput = (char: string, index: number) => {
        if (char === "") return;
        console.log("char input", char === "" ? "empty" : char, index)
        if (removedCharRefs.current[index + 1]) {
            setFocusedIndex(focusedIndexRef.current + 1);
        } else {
            setFocusedIndex(null);
            submitButtonRef.current?.focus();
        }
    }

    return (
        <div className="App">
            <Word
                wordWithUnderscores={wordData.wordWithUnderscores}
                removedCharRefs={removedCharRefs}
                onCharInput={onCharInput}
            />
            <StyledSubmitButton ref={submitButtonRef} onClick={(event) =>{
                console.log("submitting")
            }}>Submit</StyledSubmitButton>
        </div>
    );
}

export default App;
