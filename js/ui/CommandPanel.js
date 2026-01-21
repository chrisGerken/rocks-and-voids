/**
 * Command panel - chat-like command input with history
 */
class CommandPanel {
    constructor(statusPanel) {
        this.statusPanel = statusPanel;
        this.input = document.getElementById('command-input');
        this.historyContainer = document.getElementById('command-history');
        this.context = null;  // Set later with setContext

        // Bind methods to ensure correct 'this' context
        this.executeCommand = this.executeCommand.bind(this);
        this.navigateHistory = this.navigateHistory.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.setupEventListeners();
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} e
     */
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory('down');
        }
    }

    /**
     * Set execution context
     * @param {Object} context
     */
    setContext(context) {
        this.context = context;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Handle keyboard input
        this.input.addEventListener('keydown', this.handleKeyDown);

        // Reset history navigation on input
        this.input.addEventListener('input', () => {
            commandHistory.resetNavigation();
        });
    }

    /**
     * Execute the current command (supports multiple commands separated by semicolons)
     */
    executeCommand() {
        const input = this.input.value.trim();
        if (!input) return;

        // Add to history display
        this.addToHistoryDisplay(input);

        // Add to command history
        commandHistory.add(input);

        // Clear input
        this.input.value = '';

        // Split by semicolons (but not inside quoted strings)
        const commands = this.splitCommands(input);

        // Execute each command
        for (const cmd of commands) {
            const trimmedCmd = cmd.trim();
            if (!trimmedCmd) continue;

            this.executeSingleCommand(trimmedCmd);
        }
    }

    /**
     * Split input by semicolons, respecting quoted strings
     * @param {string} input
     * @returns {string[]}
     */
    splitCommands(input) {
        const commands = [];
        let current = '';
        let inQuote = false;
        let quoteChar = '';

        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            if ((char === '"' || char === "'") && (i === 0 || input[i-1] !== '\\')) {
                if (!inQuote) {
                    inQuote = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuote = false;
                }
                current += char;
            } else if (char === ';' && !inQuote) {
                commands.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        if (current) {
            commands.push(current);
        }

        return commands;
    }

    /**
     * Execute a single command
     * @param {string} input
     */
    executeSingleCommand(input) {
        // Parse command
        const parsed = commandParser.parse(input);
        if (!parsed) return;

        // Check if it's an object behavior command first
        const behaviorResult = commandRegistry.handleBehaviorCommand(parsed, this.context);
        if (behaviorResult !== null) {
            if (!behaviorResult.success) {
                this.statusPanel.error(behaviorResult.error);
            }
            return;
        }

        // Dispatch command
        try {
            const result = commandRegistry.dispatch(parsed, this.context);
            if (result && result.success === false) {
                this.statusPanel.error(result.error);
            }
        } catch (err) {
            this.statusPanel.error(`Error: ${err.message}`);
            console.error(err);
        }
    }

    /**
     * Add command to history display
     * @param {string} command
     */
    addToHistoryDisplay(command) {
        const entry = document.createElement('div');
        entry.className = 'command-entry';

        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '> ';

        const inputText = document.createElement('span');
        inputText.className = 'input';
        inputText.textContent = command;

        entry.appendChild(prompt);
        entry.appendChild(inputText);

        this.historyContainer.appendChild(entry);

        // Scroll to bottom
        this.historyContainer.scrollTop = this.historyContainer.scrollHeight;

        // Limit history display
        while (this.historyContainer.children.length > 50) {
            this.historyContainer.removeChild(this.historyContainer.firstChild);
        }
    }

    /**
     * Navigate command history
     * @param {string} direction - 'up' or 'down'
     */
    navigateHistory(direction) {
        let command;

        if (direction === 'up') {
            command = commandHistory.navigateUp(this.input.value);
        } else {
            command = commandHistory.navigateDown();
        }

        if (command !== null) {
            this.input.value = command;
            // Move cursor to end
            this.input.setSelectionRange(command.length, command.length);
        }
    }

    /**
     * Focus the input field
     */
    focus() {
        this.input.focus();
    }

    /**
     * Clear history display
     */
    clearHistory() {
        this.historyContainer.innerHTML = '';
    }

    /**
     * Set input value programmatically
     * @param {string} value
     */
    setValue(value) {
        this.input.value = value;
    }
}
