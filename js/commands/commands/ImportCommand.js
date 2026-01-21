/**
 * Import command - load commands from a text file
 */
const ImportCommand = {
    commandName: 'import',

    help: {
        description: 'Import and execute commands from a text file',
        syntax: 'import <filepath>',
        flags: {},
        examples: [
            'import script.txt',
            'import scenes/solar-system.txt'
        ]
    },

    /**
     * Validate command
     * @param {Object} parsed
     * @returns {Object}
     */
    validate(parsed) {
        // File selection is handled by the UI
        return { valid: true };
    },

    /**
     * Execute the command - triggers file picker
     * @param {Object} parsed
     * @param {Object} context
     * @returns {Object}
     */
    execute(parsed, context) {
        const { statusPanel, commandRegistry } = context;

        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';

        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) {
                statusPanel.warning('No file selected');
                return;
            }

            try {
                const content = await file.text();
                const lines = content.split('\n');

                statusPanel.info(`Importing ${file.name} (${lines.length} lines)...`);

                let executed = 0;
                let errors = 0;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();

                    // Skip empty lines and comments
                    if (!line || line.startsWith('#')) {
                        continue;
                    }

                    // Parse and execute command
                    const parsed = commandParser.parse(line);
                    if (!parsed) continue;

                    try {
                        const result = commandRegistry.dispatch(parsed, context);
                        if (result && result.success === false) {
                            statusPanel.error(`Line ${i + 1}: ${result.error}`);
                            errors++;
                        } else {
                            executed++;
                        }
                    } catch (err) {
                        statusPanel.error(`Line ${i + 1}: ${err.message}`);
                        errors++;
                    }
                }

                if (errors === 0) {
                    statusPanel.success(`Import complete: ${executed} commands executed`);
                } else {
                    statusPanel.warning(`Import complete: ${executed} commands executed, ${errors} errors`);
                }
            } catch (err) {
                statusPanel.error(`Failed to read file: ${err.message}`);
            }
        };

        // Trigger file picker
        fileInput.click();

        return { success: true, async: true };
    }
};
