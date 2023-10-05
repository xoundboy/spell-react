import React from 'react';
import styled from 'styled-components';

export type wordData = {
    inputWord: string,
    wordWithUnderscores: string,
    removedChars: Array<{ char: string, index: number }>
}

const CharSpan = styled.span`
  font-size: 80px;
  font-family: monospace, bold;
`;

const CharInputField = styled.div`
  width: 55px;
  text-align: center;
  border: 1px;
  border-radius: 9px;
  color: #a66001;
  font-size: 80px;
  font-family: monospace, bold;
  display: inline-block;

  &.focused {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    color: #ff9901;
  }
`;

export interface WordProps {
    wordWithUnderscores: string,
    focusedIndex: number,
    enteredChars: string[],
}

const Word = (props:WordProps) => {
    let currentBlankIndex = -1;
    return (
        <>{
            props.wordWithUnderscores.split('').map((char, index) => {
                if(char === "_" ) {
                    currentBlankIndex++;
                    const className = `singleCharacter focusable ${props.focusedIndex === currentBlankIndex ? 'focused' : ''}`;
                    return <CharInputField
                        className={className}
                        key={index}
                    >{props.enteredChars[currentBlankIndex] || "_"}</CharInputField>
                } else {
                    return <CharSpan key={index}>{char}</CharSpan>
                }
            })}
        </>
    );
};

export default Word;
