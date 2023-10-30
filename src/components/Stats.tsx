import React from 'react';
import styled from 'styled-components';
import { GameType, useAppStore } from '../zstore';

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
    const wordCount = useAppStore((state) => state.wordCount)
    const score = useAppStore((state) => state.score)
    const gameType = useAppStore((state) => state.gameType)
    const countDownPercentage = useAppStore((state) => state.countDownPercentage)

    return (
        <>
            <Score className="score">Score: {score}{gameType !== GameType.SPEED_UP ? `/${wordCount - 1}` : ''}</Score>
            <CountDown style={{ width: `${countDownPercentage * 0.5}%` }}/>
        </>
    );
}
export default Stats;
