/**
 * Reset command - clear all objects and reset simulation
 */
const ResetCommand = {
    commandName: 'reset',

    help: {
        description: 'Reset the simulation. Removes all objects and stops the simulation.',
        syntax: 'reset',
        flags: {},
        examples: [
            'reset'
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
        const { simulation, arena, statusPanel, commandPanel } = context;

        // Stop simulation if running
        if (simulation.isRunning()) {
            simulation.stop();
        }

        // Remove all meshes from scene
        objectRegistry.forEach(object => {
            if (object.mesh) {
                arena.removeMesh(object.mesh);
            }
            if (object.light) {
                arena.removeLight(object.light.light);
            }
        });

        // Clear registry
        const count = objectRegistry.count();
        objectRegistry.clear();

        // Reset simulation state
        simulation.reset();

        // Clear UI panels
        statusPanel.clear();
        commandPanel.clearHistory();

        statusPanel.success(`Reset complete. Removed ${count} object(s).`);

        return { success: true };
    }
};
