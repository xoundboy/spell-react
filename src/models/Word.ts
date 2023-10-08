import { wordList } from '../commonWords';
import { config } from '../config';

type CharToRemove = {
    char: string,
    index: number
}

class Word {

    public fullWord: string = "";
    public wordWithUnderscores: string = "";
    public removedChars: Array<CharToRemove> = [];

    #noOfCharsToRemove: number = 0;

    constructor() {
        while (this.#noOfCharsToRemove === 0) {
            this.fullWord = wordList[Math.floor(Math.random() * wordList.length)];
            this.#noOfCharsToRemove = Math.floor(this.fullWord.length / config.REMOVAL_RATIO);
        }
        this.prepareWord();
    }

    static validateEnteredChars(enteredChars: string[], removedChars: Array<CharToRemove>): boolean {
        let isCorrect = true;
        if (enteredChars.length !== removedChars.length) isCorrect = false;
        enteredChars.forEach((char, index) => {
            if (char !== removedChars[index].char) isCorrect = false;
        });
        return isCorrect;
    }

    private prepareWord() {
        const removedChars : Array<CharToRemove> = [];
        const randomIndices = this.chooseRemovalIndices(this.fullWord.length, this.#noOfCharsToRemove);
        // sort the indices
        randomIndices.sort((a, b) => a - b);
        let modifiedWord = this.fullWord;
        // replace chars with underscores using random indices
        randomIndices.forEach(index => {
            const charToRemove: CharToRemove = {
                char: this.fullWord.charAt(index),
                index: index
            }
            removedChars.push(charToRemove);
            // replace char with underscore
            modifiedWord = this.setCharAt(modifiedWord, index, '_');
        });

        this.wordWithUnderscores = modifiedWord;
        this.removedChars = removedChars;
    }

    private chooseRemovalIndices(wordLength: number, noOfIndices: number): number[] {
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

    private setCharAt(str: string, index: number, chr: string) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

}

export default Word;
