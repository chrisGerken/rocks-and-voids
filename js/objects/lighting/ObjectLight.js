/**
 * Light emission for objects
 */
class ObjectLight {
    constructor(parentObject, options = {}) {
        this.parent = parentObject;
        this.intensity = options.intensity || Config.lighting.defaultPointLight.intensity;
        this.oscillates = options.oscillates || false;
        this.period = options.period || 1.0;  // Oscillation period in seconds
        this.time = 0;

        // Create point light matching object color
        const color = ColorUtils.toHex(parentObject.color);
        this.light = new THREE.PointLight(
            color,
            this.intensity,
            Config.lighting.defaultPointLight.distance,
            Config.lighting.defaultPointLight.decay
        );
        this.light.position.copy(parentObject.position);

        // Track if added to scene
        this.addedToScene = false;
    }

    /**
     * Add light to scene
     * @param {Arena} arena
     */
    addToScene(arena) {
        if (!this.addedToScene) {
            arena.addLight(this.light);
            this.addedToScene = true;
        }
    }

    /**
     * Update light state
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        // Follow parent position
        this.light.position.copy(this.parent.position);

        // Handle oscillation
        if (this.oscillates) {
            this.time += deltaTime;
            const phase = (this.time % this.period) / this.period;
            // Smooth oscillation using sine wave (ranges from 0.2 to 1.0)
            const factor = 0.6 + 0.4 * Math.sin(phase * 2 * Math.PI);
            this.light.intensity = this.intensity * factor;
        }
    }

    /**
     * Set intensity
     * @param {number} intensity
     */
    setIntensity(intensity) {
        this.intensity = intensity;
        if (!this.oscillates) {
            this.light.intensity = intensity;
        }
    }

    /**
     * Enable/disable oscillation
     * @param {boolean} enabled
     * @param {number} period - Period in seconds
     */
    setOscillation(enabled, period) {
        this.oscillates = enabled;
        if (period !== undefined) {
            this.period = period;
        }
        this.time = 0;  // Reset phase

        if (!enabled) {
            this.light.intensity = this.intensity;
        }
    }

    /**
     * Get light info
     * @returns {Object}
     */
    getInfo() {
        return {
            intensity: this.intensity,
            oscillates: this.oscillates,
            period: this.oscillates ? this.period : null
        };
    }

    /**
     * Clean up resources
     */
    dispose() {
        if (this.addedToScene && this.light.parent) {
            this.light.parent.remove(this.light);
        }
        this.light.dispose();
    }
}
