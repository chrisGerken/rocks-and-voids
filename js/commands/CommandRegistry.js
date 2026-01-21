/**
 * Command registry - registers and dispatches commands
 */
class CommandRegistry {
    constructor() {
        this.commands = new Map();
    }

    /**
     * Register a command
     * @param {Object} commandClass - Command object with commandName, help, validate, execute
     */
    register(commandClass) {
        const name = commandClass.commandName.toLowerCase();
        this.commands.set(name, commandClass);
    }

    /**
     * Get a command by name
     * @param {string} name
     * @returns {Object|undefined}
     */
    get(name) {
        return this.commands.get(name.toLowerCase());
    }

    /**
     * Check if a command exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.commands.has(name.toLowerCase());
    }

    /**
     * Dispatch a parsed command
     * @param {Object} parsed - Parsed command from CommandParser
     * @param {Object} context - Execution context
     * @returns {Object} Execution result
     */
    dispatch(parsed, context) {
        // Handle --help flag
        if (parsed.flags.help) {
            const cmd = this.commands.get(parsed.name);
            if (cmd) {
                const helpText = HelpGenerator.generate(cmd);
                context.statusPanel.help(helpText);
                return { success: true };
            } else {
                // Show general help
                const helpText = HelpGenerator.generateIndex(this.commands);
                context.statusPanel.help(helpText);
                return { success: true };
            }
        }

        // Handle 'help' command without --help flag
        if (parsed.name === 'help') {
            if (parsed.positional.length > 0) {
                const cmdName = commandParser.getString(parsed.positional[0]);
                const cmd = this.commands.get(cmdName);
                if (cmd) {
                    const helpText = HelpGenerator.generate(cmd);
                    context.statusPanel.help(helpText);
                    return { success: true };
                } else {
                    return { success: false, error: `Unknown command: ${cmdName}` };
                }
            } else {
                const helpText = HelpGenerator.generateIndex(this.commands);
                context.statusPanel.help(helpText);
                return { success: true };
            }
        }

        // Find command
        const commandClass = this.commands.get(parsed.name);
        if (!commandClass) {
            return {
                success: false,
                error: `Unknown command: ${parsed.name}. Type "help" for available commands.`
            };
        }

        // Validate
        const validation = commandClass.validate(parsed);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }

        // Execute
        return commandClass.execute(parsed, context);
    }

    /**
     * Handle object behavior commands (objectname -behavior ...)
     * @param {Object} parsed
     * @param {Object} context
     * @returns {Object|null} Result or null if not a behavior command
     */
    handleBehaviorCommand(parsed, context) {
        const { statusPanel, arena } = context;
        const objectName = parsed.name;

        // Check if this is an object name
        if (!objectRegistry.has(objectName)) {
            return null;  // Not an object behavior command
        }

        const object = objectRegistry.get(objectName);
        const flags = parsed.flags;

        // Handle -still
        if (flags.still) {
            object.setBehavior(new StillBehavior());
            statusPanel.success(`"${objectName}" set to stationary`);
            return { success: true };
        }

        // Handle -orbits
        if (flags.orbits) {
            const targetName = commandParser.getString(flags.orbits);
            if (!objectRegistry.has(targetName)) {
                return { success: false, error: `Orbit target "${targetName}" not found` };
            }

            const period = flags.period ? commandParser.getNumber(flags.period) : 10;
            object.setBehavior(new OrbitBehavior({ target: targetName, period: period }));
            statusPanel.success(`"${objectName}" orbiting "${targetName}" with period ${period}s`);
            return { success: true };
        }

        // Handle -follows
        if (flags.follows) {
            const targetName = commandParser.getString(flags.follows);
            if (!objectRegistry.has(targetName)) {
                return { success: false, error: `Follow target "${targetName}" not found` };
            }

            const distance = flags.distance ? commandParser.getNumber(flags.distance) : 10;
            const speed = flags.speed ? commandParser.getNumber(flags.speed) : 50;
            object.setBehavior(new FollowBehavior({ target: targetName, distance: distance, speed: speed }));
            statusPanel.success(`"${objectName}" following "${targetName}" at distance ${distance}`);
            return { success: true };
        }

        // Handle -emits light
        const emitsValue = flags.emits ? commandParser.getString(flags.emits) : null;
        if (emitsValue === 'light' || flags.emits === true) {
            const intensity = flags.intensity ? commandParser.getNumber(flags.intensity) : 1.0;
            const oscillates = flags.oscillates !== undefined;
            const period = flags.period ? commandParser.getNumber(flags.period) : 1.0;

            object.setLight({
                intensity: intensity,
                oscillates: oscillates,
                period: period
            });

            // Add light to scene
            object.light.addToScene(arena);

            if (oscillates) {
                statusPanel.success(`"${objectName}" emitting light (intensity ${intensity}, oscillating period ${period}s)`);
            } else {
                statusPanel.success(`"${objectName}" emitting light (intensity ${intensity})`);
            }
            return { success: true };
        }

        return null;  // No recognized behavior flags
    }

    /**
     * Get all registered command names
     * @returns {string[]}
     */
    getCommandNames() {
        return Array.from(this.commands.keys());
    }
}

// Global registry instance
const commandRegistry = new CommandRegistry();

// Register all commands
commandRegistry.register(PlaceCommand);
commandRegistry.register(CameraCommand);
commandRegistry.register(StartCommand);
commandRegistry.register(StopCommand);
commandRegistry.register(ResetCommand);
commandRegistry.register(ClearCommand);
commandRegistry.register(ConfigCommand);
commandRegistry.register(ImportCommand);
