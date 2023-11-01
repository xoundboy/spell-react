export const config: Record<string, any> = {
    /**
     * Used to determine how many characters to remove from the word. E.g if the value is 1/3 then 1/3 of the characters
     * will be removed from the word.
     */
    REMOVAL_RATIO: 1/3,

    /**
     * The countdown timer at the start of the game. This can get lower as the score increases if playing "speed up" mode.
     */
    INITIAL_COUNTDOWN_SECONDS: 7,

    /**
     * The number of words to play in a "classic" game
     */
    WORDS_PER_GAME: 30,

    /**
     * Enables console logging. Also displays the "halt for debugging" button.
     */
    LOGGING_ENABLED: false,

    /**
     * All game data will be stored against this local storage key
     */
    LOCAL_STORAGE_KEY: 'spell-it-in-data',

    /**
     * The number of high scores to store for each game type
     */
    MAX_HIGH_SCORES: 5,

    /**
     * The number of seconds to display the correct answer overlay for
     */
    CORRECT_ANSWER_OVERLAY_TIMEOUT: 2000,
}

