/**
 * Stop command - pause the simulation
 */
const StopCommand = {
    commandName: 'stop',

    help: {
        description: 'Stop (pause) the simulation. Objects retain their current positions.',
        syntax: 'stop',
        flags: {},
        examples: [
            'stop'
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

        if (!simulation.isRunning()) {
            statusPanel.warning('Simulation is not running');
            return { success: true };
        }

        simulation.stop();
        statusPanel.success('Simulation stopped');

        return { success: true };
    }
};
