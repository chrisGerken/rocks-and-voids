/**
 * Base class for object behaviors (movement patterns)
 */
class Behavior {
    constructor(options = {}) {
        this.options = options;
    }

    /**
     * Called when behavior is attached to an object
     * @param {SimObject} object
     */
    onAttach(object) {
        // Override in subclass
    }

    /**
     * Called when behavior is detached from an object
     * @param {SimObject} object
     */
    onDetach(object) {
        // Override in subclass
    }

    /**
     * Update object state based on behavior
     * @param {SimObject} object - The object to update
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(object, deltaTime) {
        throw new Error('Behavior.update() must be implemented by subclass');
    }

    /**
     * Get behavior name for display
     * @returns {string}
     */
    getName() {
        return this.constructor.name.replace('Behavior', '').toLowerCase();
    }

    /**
     * Get behavior info for status display
     * @returns {Object}
     */
    getInfo() {
        return {
            type: this.getName(),
            options: this.options
        };
    }
}
