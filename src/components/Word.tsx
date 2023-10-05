import React from 'react';
import styled from 'styled-components';
import BlankLetter from './BlankLetter';

export type wordData = {
    inputWord: string,
    wordWithUnderscores: string,
    removedChars: Array<{ char: string, index: number }>
}

const CharSpan = styled.span`
  font-size: 80px;
  font-family: monospace, bold;
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
                    return <BlankLetter
                        key={index}
                        char={props.enteredChars[currentBlankIndex] || "_"}
                        isFocused={props.focusedIndex === currentBlankIndex}
                    />

                } else {
                    return <CharSpan key={index}>{char}</CharSpan>
                }
            })}
        </>
    );
};

export default Word;
