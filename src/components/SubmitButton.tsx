import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '../zstore';

const StyledSubmitButton = styled.button`
  text-align: center;
  font-size: 40px;
  font-family: monospace, bold;
  border: 1px;
  border-radius: 9px;
  background-color: #444649;
  color: #777777;
  outline: rgb(124, 124, 124) 3px solid;
  margin: 80px auto;
  display: block; 

  &.focused {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    color: #ff9901;
  }
`;

const SubmitButton = () => {
    const removedChars = useAppStore((state) => state.word).removedChars
    const focusedIndex = useAppStore(state => state.focusedIndex);
    const submitWord = useAppStore(state => state.submitWord);

    return (
        <StyledSubmitButton
            className={focusedIndex === removedChars?.length ? "focused" : "" }
            onClick={() => submitWord()}
        >Submit
        </StyledSubmitButton>
    )
};

export default SubmitButton;
