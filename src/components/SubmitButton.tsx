import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';

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
    const removedChars = useSelector((state: RootState) => state.playPage.wordData).removedChars
    const focusedIndex = useSelector((state: RootState) => state.playPage.focusedIndex)

    return (
        <StyledSubmitButton
            className={focusedIndex === removedChars.length ? "focused" : "" }
        >Submit
        </StyledSubmitButton>
    )
};

export default SubmitButton;
