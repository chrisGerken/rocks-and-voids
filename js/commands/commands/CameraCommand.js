/**
 * Camera command - position and configure the camera
 */
const CameraCommand = {
    commandName: 'camera',

    help: {
        description: 'Create, position, and configure the camera',
        syntax: [
            'camera                           Create camera with default position',
            'camera position <x> <y> <z>      Set camera position',
            'camera position (x,y,z)          Set camera position (tuple)',
            'camera lookat <object-name>      Look at an object',
            'camera lookat (x,y,z)            Look at a position'
        ],
        flags: {
            'still': 'Make camera stationary',
            'orbits': 'Make camera orbit a target (-period <time>)',
            'follows': 'Make camera follow a target (-distance <min>)'
        },
        examples: [
            'camera',
            'camera position 0 500 500',
            'camera position (0,500,500)',
            'camera lookat sun',
            'camera lookat (0,0,0)',
            'camera -orbits sun -period 30s'
        ]
    },

    /**
     * Validate command arguments
     * @param {Object} parsed
     * @returns {Object}
     */
    validate(parsed) {
        // Camera command without args just creates default camera
        return { valid: true };
    },

    /**
     * Execute the command
     * @param {Object} parsed
     * @param {Object} context
     * @returns {Object}
     */
    execute(parsed, context) {
        const { arena, statusPanel } = context;
        const pos = parsed.positional;
        const flags = parsed.flags;

        // Get or create camera
        let camera = objectRegistry.getCamera();
        let created = false;

        if (!camera) {
            camera = new SimCamera();
            objectRegistry.setCamera(camera);
            created = true;
        }

        // Process subcommand
        if (pos.length > 0) {
            const subcommand = commandParser.getString(pos[0]).toLowerCase();

            if (subcommand === 'position') {
                // Handle position command
                let x, y, z;

                if (pos.length >= 4) {
                    // position x y z
                    x = commandParser.getNumber(pos[1]);
                    y = commandParser.getNumber(pos[2]);
                    z = commandParser.getNumber(pos[3]);
                } else if (pos.length >= 2 && pos[1].type === 'coordinate') {
                    // position (x,y,z)
                    x = pos[1].x;
                    y = pos[1].y;
                    z = pos[1].z;
                } else {
                    return {
                        success: false,
                        error: 'Invalid position format. Use: camera position x y z  or  camera position (x,y,z)'
                    };
                }

                camera.setPosition(x, y, z);
                statusPanel.success(`Camera positioned at (${x}, ${y}, ${z})`);

            } else if (subcommand === 'lookat') {
                // Handle lookat command
                if (pos.length < 2) {
                    return { success: false, error: 'Missing look-at target' };
                }

                if (pos[1].type === 'coordinate') {
                    // Look at position
                    camera.lookAtPosition(pos[1].x, pos[1].y, pos[1].z);
                    statusPanel.success(`Camera looking at (${pos[1].x}, ${pos[1].y}, ${pos[1].z})`);
                } else {
                    // Look at object
                    const targetName = commandParser.getString(pos[1]);
                    if (!objectRegistry.has(targetName)) {
                        return { success: false, error: `Object "${targetName}" not found` };
                    }
                    camera.setLookAt(targetName);
                    statusPanel.success(`Camera looking at "${targetName}"`);
                }
            } else {
                return { success: false, error: `Unknown camera subcommand: ${subcommand}` };
            }
        }

        // Handle behavior flags
        if (flags.still) {
            camera.setBehavior(new StillBehavior());
            statusPanel.info('Camera set to stationary');
        } else if (flags.orbits) {
            const targetName = commandParser.getString(flags.orbits);
            if (!objectRegistry.has(targetName)) {
                return { success: false, error: `Orbit target "${targetName}" not found` };
            }

            const period = flags.period ? commandParser.getNumber(flags.period) : 30;
            camera.setBehavior(new OrbitBehavior({ target: targetName, period: period }));
            statusPanel.info(`Camera orbiting "${targetName}" with period ${period}s`);
        } else if (flags.follows) {
            const targetName = commandParser.getString(flags.follows);
            if (!objectRegistry.has(targetName)) {
                return { success: false, error: `Follow target "${targetName}" not found` };
            }

            const distance = flags.distance ? commandParser.getNumber(flags.distance) : 50;
            camera.setBehavior(new FollowBehavior({ target: targetName, distance: distance }));
            statusPanel.info(`Camera following "${targetName}" at distance ${distance}`);
        }

        if (created && pos.length === 0 && Object.keys(flags).length === 0) {
            statusPanel.success(`Camera created at default position (${Config.camera.defaultPosition.x}, ${Config.camera.defaultPosition.y}, ${Config.camera.defaultPosition.z})`);
        }

        return { success: true, camera: camera };
    }
};
