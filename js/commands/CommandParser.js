/**
 * Command parser - tokenizes and parses command input
 */
class CommandParser {
    /**
     * Tokenize input respecting quoted strings
     * @param {string} input
     * @returns {string[]}
     */
    tokenize(input) {
        const tokens = [];
        const regex = /(?:"([^"]+)"|'([^']+)'|(\S+))/g;
        let match;

        while ((match = regex.exec(input)) !== null) {
            // Use captured group 1, 2, or 3
            tokens.push(match[1] || match[2] || match[3]);
        }

        return tokens;
    }

    /**
     * Parse input into structured command
     * @param {string} input
     * @returns {Object|null}
     */
    parse(input) {
        // Strip comments
        const commentIndex = input.indexOf('#');
        if (commentIndex !== -1) {
            input = input.substring(0, commentIndex);
        }

        input = input.trim();
        if (!input) {
            return null;
        }

        const tokens = this.tokenize(input);
        if (tokens.length === 0) {
            return null;
        }

        const command = {
            name: tokens[0].toLowerCase(),
            positional: [],
            flags: {},
            raw: input
        };

        let i = 1;
        while (i < tokens.length) {
            const token = tokens[i];

            if (token === '--help') {
                command.flags.help = true;
                i++;
            } else if (token.startsWith('--')) {
                // Long flag without value (boolean)
                command.flags[token.substring(2)] = true;
                i++;
            } else if (token.startsWith('-') && token.length > 1) {
                // Flag with value (e.g., -period 20s)
                const flagName = token.substring(1);
                const nextToken = tokens[i + 1];

                // Check if next token exists and isn't a flag
                if (nextToken && !nextToken.startsWith('-')) {
                    command.flags[flagName] = this.parseValue(nextToken);
                    i += 2;
                } else {
                    // Boolean flag
                    command.flags[flagName] = true;
                    i++;
                }
            } else {
                // Positional argument
                command.positional.push(this.parseValue(token));
                i++;
            }
        }

        return command;
    }

    /**
     * Parse value into appropriate type
     * @param {string} value
     * @returns {Object}
     */
    parseValue(value) {
        // Handle coordinate tuples: (10,10,10) or (10, 10, 10)
        const coordMatch = value.match(/^\((-?[\d.]+),\s*(-?[\d.]+),\s*(-?[\d.]+)\)$/);
        if (coordMatch) {
            return {
                type: 'coordinate',
                x: parseFloat(coordMatch[1]),
                y: parseFloat(coordMatch[2]),
                z: parseFloat(coordMatch[3])
            };
        }

        // Handle time values: 20s, 5m, 100ms
        const timeMatch = value.match(/^(-?[\d.]+)(ms|s|m|h)$/i);
        if (timeMatch) {
            const num = parseFloat(timeMatch[1]);
            const unit = timeMatch[2].toLowerCase();
            let seconds;

            switch (unit) {
                case 'ms': seconds = num / 1000; break;
                case 's': seconds = num; break;
                case 'm': seconds = num * 60; break;
                case 'h': seconds = num * 3600; break;
                default: seconds = num;
            }

            return {
                type: 'time',
                value: seconds,
                original: value
            };
        }

        // Handle plain numbers
        if (!isNaN(value) && value !== '') {
            return {
                type: 'number',
                value: parseFloat(value)
            };
        }

        // Default to string
        return {
            type: 'string',
            value: value
        };
    }

    /**
     * Extract string value from parsed value
     * @param {Object|string} parsed
     * @returns {string}
     */
    getString(parsed) {
        if (typeof parsed === 'string') return parsed;
        return parsed.value !== undefined ? String(parsed.value) : String(parsed);
    }

    /**
     * Extract number value from parsed value
     * @param {Object|number} parsed
     * @returns {number}
     */
    getNumber(parsed) {
        if (typeof parsed === 'number') return parsed;
        if (parsed.type === 'number' || parsed.type === 'time') return parsed.value;
        return parseFloat(parsed.value || parsed);
    }

    /**
     * Extract coordinate from parsed value
     * @param {Object} parsed
     * @returns {Object|null}
     */
    getCoordinate(parsed) {
        if (parsed.type === 'coordinate') {
            return { x: parsed.x, y: parsed.y, z: parsed.z };
        }
        return null;
    }
}

// Global parser instance
const commandParser = new CommandParser();
