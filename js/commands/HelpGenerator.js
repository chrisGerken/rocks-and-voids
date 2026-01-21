/**
 * Help text generator for commands
 */
const HelpGenerator = {
    /**
     * Generate help text for a command
     * @param {Object} commandClass - Command class with static help property
     * @returns {string}
     */
    generate(commandClass) {
        if (!commandClass || !commandClass.help) {
            return 'No help available for this command.';
        }

        const help = commandClass.help;
        const lines = [];

        // Command name and description
        lines.push(`${commandClass.commandName.toUpperCase()}`);
        lines.push('');
        lines.push(help.description);
        lines.push('');

        // Syntax
        if (help.syntax) {
            lines.push('SYNTAX:');
            if (Array.isArray(help.syntax)) {
                help.syntax.forEach(s => lines.push(`  ${s}`));
            } else {
                lines.push(`  ${help.syntax}`);
            }
            lines.push('');
        }

        // Flags/Options
        if (help.flags && Object.keys(help.flags).length > 0) {
            lines.push('OPTIONS:');
            for (const [flag, desc] of Object.entries(help.flags)) {
                lines.push(`  -${flag.padEnd(15)} ${desc}`);
            }
            lines.push('');
        }

        // Examples
        if (help.examples && help.examples.length > 0) {
            lines.push('EXAMPLES:');
            help.examples.forEach(ex => lines.push(`  ${ex}`));
            lines.push('');
        }

        return lines.join('\n');
    },

    /**
     * Generate general help listing all commands
     * @param {Map} commands - Map of command name to command class
     * @returns {string}
     */
    generateIndex(commands) {
        const lines = [];
        lines.push('ROCKS AND VOIDS - Command Reference');
        lines.push('');
        lines.push('Available commands:');
        lines.push('');

        const sorted = Array.from(commands.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        for (const [name, cmd] of sorted) {
            const desc = cmd.help ? cmd.help.description : 'No description';
            lines.push(`  ${name.padEnd(12)} ${desc}`);
        }

        lines.push('');
        lines.push('Type "<command> --help" for detailed help on a specific command.');
        lines.push('');
        lines.push('COORDINATE SYSTEM:');
        lines.push('  Uses three.js conventions: Y-up, right-handed coordinate system.');
        lines.push('  Origin (0,0,0) is at the center of the arena.');
        lines.push('');
        lines.push('SIZE REFERENCE:');
        lines.push('  small  = 0.25m');
        lines.push('  medium = 1m (default)');
        lines.push('  large  = 2m');

        return lines.join('\n');
    }
};
