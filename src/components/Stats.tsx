import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';

const Score = styled.div`
  color: #555cc7;
  font-size: 40px;
  font-family: monospace, bold;
  padding: 40px;
`;

const Stats = () => {
    const wordCount = useSelector((state: RootState) => state.playPage.wordCount)
    const score = useSelector((state: RootState) => state.playPage.score)

    return (
        <Score className="score">Score: {score}/{wordCount}</Score>
    );
}
export default Stats;
