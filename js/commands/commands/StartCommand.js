/**
 * Start command - begin the simulation
 */
const StartCommand = {
    commandName: 'start',

    help: {
        description: 'Start the simulation. Requires a camera to be defined.',
        syntax: 'start',
        flags: {},
        examples: [
            'start'
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
        const { simulation, statusPanel } = context;

        // Check if camera exists
        if (!objectRegistry.hasCamera()) {
            return {
                success: false,
                error: 'Cannot start simulation: No camera defined. Use "camera" command first.'
            };
        }

        // Check if already running
        if (simulation.isRunning()) {
            statusPanel.warning('Simulation is already running');
            return { success: true };
        }

        // Start simulation
        simulation.start();
        statusPanel.success('Simulation started');

        return { success: true };
    }
};
