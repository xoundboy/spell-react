import { config } from '../config';

type CharToRemove = {
    char: string,
    index: number
}

interface IWord {
    wordList: string[];
    inputWord: string;
    wordWithUnderscores: string;
    removedChars: Array<CharToRemove>;
    removedCharIndices: number[];
    enteredChars: string[];
    attemptedWord: string;
    submitEnteredChars(enteredChars: string[]): void;
    isValid(): boolean;
}

class Word implements IWord {
    public wordList: string[] = [];
    public inputWord: string = "";
    public wordWithUnderscores: string = "";
    public removedChars: Array<CharToRemove> = [];
    public removedCharIndices: number[] = [];
    public enteredChars: string[] = [];
    public attemptedWord: string = "";

    constructor(wordList: string[] = []) {
        this.wordList = wordList;
        let noOfCharsToRemove = 0;
        while (noOfCharsToRemove === 0) {
            this.inputWord = wordList[Math.floor(Math.random() * wordList?.length)];
            noOfCharsToRemove = Math.floor(this.inputWord?.length / config.REMOVAL_RATIO);
        }
        this.prepareWord(noOfCharsToRemove);
    }

    public submitEnteredChars(enteredChars: string[]): void {
        this.enteredChars = enteredChars;
        this.rehydrateWord();
    }

    public isValid(): boolean {
        return this.inputWord === this.attemptedWord || this.wordList.includes(this.attemptedWord)
    }

    private rehydrateWord(): void {
        // recreate entire word from entered chars
        const rehydratedWord = this.wordWithUnderscores.split('');
        this.wordWithUnderscores.split('').forEach((char: string, index: number) => {
            if (char === '_') {
                rehydratedWord[index] = this.enteredChars.shift() as string;
            }
        });
        this.attemptedWord = rehydratedWord.join('').toLowerCase();
    }

    private prepareWord(noOfCharsToRemove: number) {
        const removedChars : Array<CharToRemove> = [];
        const randomIndices = this.chooseRemovalIndices(this.inputWord?.length, noOfCharsToRemove);
        randomIndices.sort((a, b) => a - b);
        let modifiedWord = this.inputWord;
        randomIndices.forEach(index => {
            const charToRemove: CharToRemove = {
                char: this.inputWord.charAt(index),
                index: index
            }
            removedChars.push(charToRemove);
            // replace char with underscore
            modifiedWord = this.setCharAt(modifiedWord, index, '_');
        });

        this.wordWithUnderscores = modifiedWord;
        this.removedChars = removedChars;
        this.removedCharIndices = randomIndices;
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
        if(index > str?.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }
}

export default Word;
