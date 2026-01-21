/**
 * Config command - view and modify configuration
 */
const ConfigCommand = {
    commandName: 'config',

    help: {
        description: 'View or modify simulation configuration',
        syntax: [
            'config                    Show current configuration',
            'config arena <size>       Set arena size in meters',
            'config frametime <sec>    Set frame time in seconds',
            'config basesize <meters>  Set base object size (medium)'
        ],
        flags: {},
        examples: [
            'config',
            'config arena 2000',
            'config frametime 0.05',
            'config basesize 10'
        ]
    },

    // Runtime config (modifiable)
    runtimeConfig: {
        arenaSize: Config.arena.size,
        frameTime: Config.simulation.frameTime,
        baseSize: Config.objects.baseSize
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
        const { arena, simulation, statusPanel } = context;
        const pos = parsed.positional;

        // No args - show current config
        if (pos.length === 0) {
            const lines = [
                'Current Configuration:',
                `  Arena size:  ${this.runtimeConfig.arenaSize}m`,
                `  Frame time:  ${this.runtimeConfig.frameTime}s (${(1/this.runtimeConfig.frameTime).toFixed(1)} FPS)`,
                `  Base size:   ${this.runtimeConfig.baseSize}m`,
                '',
                'Object Sizes:',
                `  Small:  ${this.runtimeConfig.baseSize * 0.25}m`,
                `  Medium: ${this.runtimeConfig.baseSize}m`,
                `  Large:  ${this.runtimeConfig.baseSize * 2}m`
            ];
            statusPanel.help(lines.join('\n'));
            return { success: true };
        }

        // Get setting name and value
        const setting = commandParser.getString(pos[0]).toLowerCase();

        if (pos.length < 2) {
            return { success: false, error: `Missing value for "${setting}"` };
        }

        const value = commandParser.getNumber(pos[1]);

        switch (setting) {
            case 'arena':
                if (value <= 0) {
                    return { success: false, error: 'Arena size must be positive' };
                }
                this.runtimeConfig.arenaSize = value;
                arena.setSize(value);
                statusPanel.success(`Arena size set to ${value}m`);
                break;

            case 'frametime':
                if (value <= 0) {
                    return { success: false, error: 'Frame time must be positive' };
                }
                this.runtimeConfig.frameTime = value;
                simulation.setFrameTime(value);
                statusPanel.success(`Frame time set to ${value}s (${(1/value).toFixed(1)} FPS)`);
                break;

            case 'basesize':
                if (value <= 0) {
                    return { success: false, error: 'Base size must be positive' };
                }
                this.runtimeConfig.baseSize = value;
                statusPanel.success(`Base object size set to ${value}m`);
                statusPanel.info(`New objects: small=${value*0.25}m, medium=${value}m, large=${value*2}m`);
                break;

            default:
                return {
                    success: false,
                    error: `Unknown setting: ${setting}. Available: arena, frametime, basesize`
                };
        }

        return { success: true };
    },

    /**
     * Get current base size (used by ShapeFactory)
     * @returns {number}
     */
    getBaseSize() {
        return this.runtimeConfig.baseSize;
    }
};
