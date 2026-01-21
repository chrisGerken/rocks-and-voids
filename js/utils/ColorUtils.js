/**
 * Color utilities for named color mapping
 */
const ColorUtils = {
    // Named color map
    colors: {
        // Basic colors
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        yellow: 0xffff00,
        cyan: 0x00ffff,
        magenta: 0xff00ff,
        white: 0xffffff,
        black: 0x000000,

        // Grays
        gray: 0x808080,
        grey: 0x808080,
        darkgray: 0x404040,
        darkgrey: 0x404040,
        lightgray: 0xc0c0c0,
        lightgrey: 0xc0c0c0,

        // Extended colors
        orange: 0xff8000,
        pink: 0xff69b4,
        purple: 0x800080,
        brown: 0x8b4513,
        gold: 0xffd700,
        silver: 0xc0c0c0,

        // Space colors
        coral: 0xff7f50,
        crimson: 0xdc143c,
        indigo: 0x4b0082,
        navy: 0x000080,
        teal: 0x008080,
        olive: 0x808000,
        maroon: 0x800000,

        // Light variants
        lightblue: 0xadd8e6,
        lightgreen: 0x90ee90,
        lightyellow: 0xffffe0,
        lightpink: 0xffb6c1
    },

    /**
     * Convert named color to hex value
     * @param {string} name - Color name
     * @returns {number} Hex color value
     */
    toHex(name) {
        const lowerName = name.toLowerCase();
        if (this.colors.hasOwnProperty(lowerName)) {
            return this.colors[lowerName];
        }

        // Try parsing as hex string (e.g., "#ff0000" or "ff0000")
        if (name.startsWith('#')) {
            return parseInt(name.slice(1), 16);
        }
        if (/^[0-9a-f]{6}$/i.test(name)) {
            return parseInt(name, 16);
        }

        // Default to white if unknown
        console.warn(`Unknown color: ${name}, defaulting to white`);
        return 0xffffff;
    },

    /**
     * Convert hex to THREE.Color
     * @param {string|number} color - Color name or hex value
     * @returns {THREE.Color} three.js Color object
     */
    toThreeColor(color) {
        if (typeof color === 'string') {
            return new THREE.Color(this.toHex(color));
        }
        return new THREE.Color(color);
    },

    /**
     * Get list of available color names
     * @returns {string[]} Array of color names
     */
    getAvailableColors() {
        return Object.keys(this.colors);
    },

    /**
     * Check if a color name is valid
     * @param {string} name - Color name
     * @returns {boolean} True if valid
     */
    isValidColor(name) {
        const lowerName = name.toLowerCase();
        return this.colors.hasOwnProperty(lowerName) ||
               name.startsWith('#') ||
               /^[0-9a-f]{6}$/i.test(name);
    }
};
