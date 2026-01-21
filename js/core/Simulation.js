/**
 * Simulation controller - manages the animation loop
 */
class Simulation {
    constructor() {
        this.running = false;
        this.frameTime = Config.simulation.frameTime;
        this.lastTime = 0;
        this.animationId = null;
        this.renderPanel = null;
        this.accumulator = 0;
    }

    /**
     * Set render panel reference
     * @param {RenderPanel} renderPanel
     */
    setRenderPanel(renderPanel) {
        this.renderPanel = renderPanel;
    }

    /**
     * Start the simulation
     */
    start() {
        if (this.running) return;

        // Validate camera exists
        if (!objectRegistry.hasCamera()) {
            throw new Error('Camera must be defined before starting simulation');
        }

        this.running = true;
        this.lastTime = performance.now();
        this.accumulator = 0;

        eventBus.emit('simulation:started');
        this.loop();
    }

    /**
     * Stop the simulation
     */
    stop() {
        this.running = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        eventBus.emit('simulation:stopped');
    }

    /**
     * Reset simulation state
     */
    reset() {
        this.stop();
        this.accumulator = 0;
        eventBus.emit('simulation:reset');
    }

    /**
     * Check if simulation is running
     * @returns {boolean}
     */
    isRunning() {
        return this.running;
    }

    /**
     * Set frame time (physics time step)
     * @param {number} frameTime - Time in seconds
     */
    setFrameTime(frameTime) {
        this.frameTime = frameTime;
    }

    /**
     * Main animation loop
     */
    loop() {
        if (!this.running) return;

        const now = performance.now();
        const deltaTime = (now - this.lastTime) / 1000;  // Convert to seconds
        this.lastTime = now;

        // Accumulate time
        this.accumulator += deltaTime;

        // Fixed time step physics updates
        while (this.accumulator >= this.frameTime) {
            this.update(this.frameTime);
            this.accumulator -= this.frameTime;
        }

        // Render at display refresh rate
        this.render();

        this.animationId = requestAnimationFrame(() => this.loop());
    }

    /**
     * Update all objects
     * @param {number} deltaTime - Fixed time step in seconds
     */
    update(deltaTime) {
        // Update all objects via behavior manager
        behaviorManager.updateAll(deltaTime);

        eventBus.emit('simulation:update', { deltaTime: deltaTime });
    }

    /**
     * Render the scene
     */
    render() {
        if (this.renderPanel) {
            this.renderPanel.render();
        }
    }

    /**
     * Perform a single update step (for debugging)
     * @param {number} deltaTime
     */
    step(deltaTime = null) {
        const dt = deltaTime || this.frameTime;
        this.update(dt);
        this.render();
    }
}

// Global simulation instance
const simulation = new Simulation();
