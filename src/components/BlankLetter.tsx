import styled from 'styled-components';

const CharInputField = styled.div`
  width: 55px;
  text-align: center;
  border: 1px;
  border-radius: 9px;
  color: rgb(52, 89, 35);
  margin: 0 4px;
  font-size: 80px;
  font-family: monospace, bold;
  display: inline-block;
  &.focused {
    outline: 3px solid green;
    background-color: rgb(52, 89, 35);
    caret-color: transparent;
  }
`;

interface BlankLetterProps {
    char: string,
    isFocused: boolean,
}

const BlankLetter = (props: BlankLetterProps) => {
    console.log(props.char, props.isFocused)
    const className = `singleCharacter focusable ${props.isFocused ? 'focused' : ''}`;
    return (
        <CharInputField className={className}>
            {props.char}
        </CharInputField>
    )
}

export default BlankLetter;
