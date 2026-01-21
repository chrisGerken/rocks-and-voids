/**
 * Time parsing utilities
 */
const TimeUtils = {
    /**
     * Parse time string to seconds
     * Supports: "10s" (seconds), "5m" (minutes), "1h" (hours), "500ms" (milliseconds)
     * @param {string|number} value - Time value
     * @returns {number} Time in seconds
     */
    parseToSeconds(value) {
        if (typeof value === 'number') {
            return value;
        }

        const str = String(value).trim().toLowerCase();

        // Match number with optional unit
        const match = str.match(/^(-?[\d.]+)\s*(ms|s|m|h)?$/);
        if (!match) {
            throw new Error(`Invalid time format: ${value}`);
        }

        const num = parseFloat(match[1]);
        const unit = match[2] || 's';  // Default to seconds

        switch (unit) {
            case 'ms':
                return num / 1000;
            case 's':
                return num;
            case 'm':
                return num * 60;
            case 'h':
                return num * 3600;
            default:
                return num;
        }
    },

    /**
     * Format seconds to human-readable string
     * @param {number} seconds
     * @returns {string}
     */
    format(seconds) {
        if (seconds < 1) {
            return `${(seconds * 1000).toFixed(0)}ms`;
        }
        if (seconds < 60) {
            return `${seconds.toFixed(1)}s`;
        }
        if (seconds < 3600) {
            return `${(seconds / 60).toFixed(1)}m`;
        }
        return `${(seconds / 3600).toFixed(1)}h`;
    },

    /**
     * Check if a string is a valid time format
     * @param {string} value
     * @returns {boolean}
     */
    isValidTimeFormat(value) {
        const str = String(value).trim().toLowerCase();
        return /^-?[\d.]+\s*(ms|s|m|h)?$/.test(str);
    }
};
