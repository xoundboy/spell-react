import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { config } from '../config';
import { deleteChar, enterChar, submitWord, tab, tabBack } from '../playPageSlice';
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
    const dispatch = useDispatch()

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (true) {

                case event.key === "Backspace":
                    dispatch(deleteChar());
                    break;

                case event.key === "Enter":
                    dispatch(submitWord());
                    break;

                case event.key === "Tab":
                    event.preventDefault();
                    if (event.shiftKey) {
                        dispatch(tabBack())
                    } else {
                        dispatch(tab())
                    }
                    break;

                case event.key.length > 1:
                    break;

                case !!event.key.match(/[a-z]/i) :
                    dispatch(enterChar(event.key));
                    break;

                default:
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

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
