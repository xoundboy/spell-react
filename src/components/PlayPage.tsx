import React, { useEffect } from 'react';
import styled from 'styled-components';
import { config } from '../config';
import { Page, useAppStore } from '../zstore';
import HaltButton from './HaltButton';
import Stats from './Stats';
import SubmitButton from './SubmitButton';
import Word from './Word';

const StyledPage = styled.div`
  background:rgba(30,30,40,.9);
  justify-content: center;
  text-align: center;
  height: 100vh;`

function PlayPage() {
    const focusNext = useAppStore(state => state.focusNext);
    const focusPrev = useAppStore(state => state.focusPrev);
    const enterChar = useAppStore(state => state.enterChar);
    const deleteChar = useAppStore(state => state.deleteChar);
    const submitWord = useAppStore(state => state.submitWord);
    const switchPage = useAppStore(state => state.switchPage);
    const isGameOver = useAppStore(state => state.isGameOver);

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (true) {

            case event.key === "Backspace":
                deleteChar();
                break;

            case event.key === "Enter":
                submitWord();
                break;

            case event.key === "Tab":
                event.preventDefault();
                if (event.shiftKey) {
                    focusPrev();
                } else {
                    focusNext();
                }
                break;

            case event.key?.length > 1:
                break;

            case !!event.key.match(/[a-z]/i) :
                enterChar(event.key);
                break;

            default:
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isGameOver) {
            window.removeEventListener("keydown", handleKeyDown);
            switchPage(Page.RESULTS);
        } else {
            window.addEventListener("keydown", handleKeyDown);
        }
    }, [isGameOver]);

    return (
        <StyledPage>
            <Stats />
            <Word />
            <SubmitButton />
            {config.LOGGING_ENABLED && <HaltButton />}
        </StyledPage>
    );
}

export default PlayPage;
