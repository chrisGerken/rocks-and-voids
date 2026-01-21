/**
 * Command history for up/down navigation
 */
class CommandHistory {
    constructor(maxSize = 100) {
        this.history = [];
        this.maxSize = maxSize;
        this.currentIndex = -1;  // -1 means not navigating history
        this.tempInput = '';  // Stores current input when navigating
    }

    /**
     * Add a command to history
     * @param {string} command
     */
    add(command) {
        const trimmed = command.trim();
        if (!trimmed) return;

        // Don't add duplicates of the last command
        if (this.history.length > 0 && this.history[this.history.length - 1] === trimmed) {
            return;
        }

        this.history.push(trimmed);

        // Trim to max size
        if (this.history.length > this.maxSize) {
            this.history.shift();
        }

        // Reset navigation
        this.currentIndex = -1;
        this.tempInput = '';
    }

    /**
     * Navigate up (older commands)
     * @param {string} currentInput - Current input to save
     * @returns {string|null} Previous command or null
     */
    navigateUp(currentInput) {
        if (this.history.length === 0) return null;

        // Save current input if starting navigation
        if (this.currentIndex === -1) {
            this.tempInput = currentInput;
            this.currentIndex = this.history.length;
        }

        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }

        // At the beginning, return first item
        return this.history[0];
    }

    /**
     * Navigate down (newer commands)
     * @returns {string|null} Next command, temp input, or null
     */
    navigateDown() {
        if (this.currentIndex === -1) return null;

        this.currentIndex++;

        if (this.currentIndex >= this.history.length) {
            // Return to current input
            this.currentIndex = -1;
            return this.tempInput;
        }

        return this.history[this.currentIndex];
    }

    /**
     * Reset navigation state
     */
    resetNavigation() {
        this.currentIndex = -1;
        this.tempInput = '';
    }

    /**
     * Get all history
     * @returns {string[]}
     */
    getAll() {
        return [...this.history];
    }

    /**
     * Clear history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.tempInput = '';
    }
}

// Global history instance
const commandHistory = new CommandHistory();
