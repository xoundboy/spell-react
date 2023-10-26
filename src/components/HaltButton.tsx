import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '../zstore';

const StyledButton = styled.button`
  background: #721a1a;
  color: #ffffff;
  font-size: 32px;
  padding: 20px;
  font-family: monospace, bold;
  display: inline-block;
  border: 1px solid #ff0000;
  border-radius: 9px;

  &:hover {
    background: #9a5f5f;
    color: #0eff00;
  }
`;

const HaltButton = () => {
    const pauseCountdown = useAppStore((state) => state.pauseCountdown)
    return (
        <StyledButton onClick={() => pauseCountdown()}>Halt for debugging</StyledButton>
    );
}

export default HaltButton;
