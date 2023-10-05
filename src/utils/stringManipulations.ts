import { config } from '../config';
import { wordData } from '../components/Word';

export const prepareWord = (inputWord: string): wordData => {
    const removedChars = [];
    const noOfCharsToRemove = Math.floor(inputWord.length / config.REMOVAL_RATIO);
    let modifiedWord = inputWord;

    // remove random chars
    for (let i = 0; i < noOfCharsToRemove; i++) {
        let indexToRemove = Math.floor(Math.random() * modifiedWord.length);
        const charToRemove = {
            char: modifiedWord.charAt(indexToRemove),
            index: indexToRemove
        }
        removedChars.push(charToRemove);
        modifiedWord = modifiedWord.substring(0, indexToRemove)
            + modifiedWord.substring(indexToRemove + 1, modifiedWord.length);
    }

    // add underscores
    for (let i = removedChars.length - 1; i >= 0; i--) {
        const index = removedChars[i].index;
        modifiedWord = insertCharIntoString(modifiedWord, index, '_');
    }

    return {
        inputWord: inputWord,
        wordWithUnderscores: modifiedWord,
        removedChars: removedChars
    };
}

function insertCharIntoString (inputString: string, index: number, charToInsert: string): string {
    let modifiedString = inputString;
    modifiedString = modifiedString.substring(0, index) + charToInsert
        + modifiedString.substring(index, modifiedString.length);
    return modifiedString;
}
