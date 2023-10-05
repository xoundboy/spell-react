import { wordList } from '../commonWords';
import { config } from '../config';
import { wordData } from '../components/Word';

type CharToRemove = {
    char: string,
    index: number
}

export const getNewWord = ():wordData => {
    let word = wordList[Math.floor(Math.random() * wordList.length)];
    const wordData = prepareWord(word);
    return wordData.removedChars.length > 0 ? wordData : getNewWord();
}

const getRandomIndices = (wordLength: number, noOfIndices: number): number[] => {
    const indices: number[] = [];
    for (let i = 0; i < noOfIndices; i++) {
        let index = Math.floor(Math.random() * wordLength);
        while (indices.includes(index)) {
            index = Math.floor(Math.random() * wordLength);
        }
        indices.push(index);
    }
    return indices;
}

const prepareWord = (inputWord: string): wordData => {
    const removedChars : Array<CharToRemove> = [];
    const noOfCharsToRemove = Math.floor(inputWord.length / config.REMOVAL_RATIO);
    const randomIndices = getRandomIndices(inputWord.length, noOfCharsToRemove);
    // sort the indices
    randomIndices.sort((a, b) => a - b);
    let modifiedWord = inputWord;
    // replace chars with underscores using random indices
    randomIndices.forEach(index => {
        const charToRemove: CharToRemove = {
            char: inputWord.charAt(index),
            index: index
        }
        removedChars.push(charToRemove);
        // replace char with underscore
        modifiedWord = setCharAt(modifiedWord, index, '_');
    });

    return {
        inputWord: inputWord,
        wordWithUnderscores: modifiedWord,
        removedChars: removedChars
    };
}

const setCharAt = (str: string, index: number, chr: string) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}
