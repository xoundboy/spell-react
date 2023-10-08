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

const CountDown = styled.div`
  background-color: #63078d;
  width: 300px;
  margin: 0 auto 40px;
  height: 20px;
`;

const Stats = () => {
    const wordCount = useSelector((state: RootState) => state.playPage.wordCount)
    const score = useSelector((state: RootState) => state.playPage.score)
    const countDownPercentage = useSelector((state: RootState) => state.playPage.countDownPercentage)

    return (
        <>
            <Score className="score">Score: {score}/{wordCount}</Score>
            <CountDown style={{ width: `${countDownPercentage * 0.5}%` }}/>
        </>
    );
}
export default Stats;
