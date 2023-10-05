import React, { ComponentProps, ComponentPropsWithRef, LegacyRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { wordList } from '../commonWords';
import { prepareWord } from '../utils/stringManipulations';

export type wordData = {
    inputWord: string,
    wordWithUnderscores: string,
    removedChars: Array<{ char: string, index: number }>,
    attempt: string
}

type removedChar = {
    char: string,
    index: number
}

const WordContainer = styled.div`
  text-align: center;
  color: #BF4F74;
  font-family: monospace, bold;
  margin-top:20px;
`;

const CharSpan = styled.span`
  font-size: 80px;
`;
const CharInputField = styled.input`
  width: 55px;
  text-align: center;
  border: 1px;
  border-radius: 9px;
  background-color: #444649;
  color: #BF4F74;
  outline: rgb(124, 124, 124) 3px solid;
  margin: 0 4px;
  font-size: 80px;
  font-family: monospace, bold;
  &:focus {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    caret-color: transparent;
  }
`;

export interface WordProps {
    wordWithUnderscores: string,
    onCharInput: (char: string, index: number) => void,
    removedCharRefs:  React.MutableRefObject<(HTMLInputElement | undefined)[]>
}

const Word = React.forwardRef((props:WordProps, ref) => {

    let blankIndex = 0;

    return (
        <WordContainer>{
            props.wordWithUnderscores.split('').map((char, index) => {
                if(char === "_" ) {
                    const currentBlankIndex = blankIndex;
                    blankIndex++
                    return <CharInputField
                        ref={(el: HTMLInputElement) => {
                            props.removedCharRefs.current[currentBlankIndex] = el;
                            return el;
                        }}
                        key={index}
                        type="text"
                        maxLength={1}
                        className="singleCharacter focusable"
                        onChange={(e) => {
                            props.onCharInput(e.target.value, currentBlankIndex)
                        }}
                    />

                } else {
                    return <CharSpan key={index}>{char}</CharSpan>
                }
            })}
        </WordContainer>
    );
});

export default Word;
