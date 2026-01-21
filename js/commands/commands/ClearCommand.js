/**
 * Clear command - clear the status and command history panels
 */
const ClearCommand = {
    commandName: 'clear',

    help: {
        description: 'Clear the status messages and command history display',
        syntax: 'clear',
        flags: {},
        examples: [
            'clear'
        ]
    },

    /**
     * Validate command
     * @param {Object} parsed
     * @returns {Object}
     */
    validate(parsed) {
        return { valid: true };
    },

    /**
     * Execute the command
     * @param {Object} parsed
     * @param {Object} context
     * @returns {Object}
     */
    execute(parsed, context) {
        const { statusPanel, commandPanel } = context;

        // Clear UI panels
        statusPanel.clear();
        commandPanel.clearHistory();

        return { success: true };
    }
};
