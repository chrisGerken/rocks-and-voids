/**
 * Place command - create and position objects in the arena
 */
const PlaceCommand = {
    commandName: 'place',

    help: {
        description: 'Create and place an object in the arena',
        syntax: 'place <size> <color> <shape> named "<name>" at (x,y,z)',
        flags: {},
        examples: [
            'place medium red cube named "cube1" at (10,10,10)',
            'place small yellow sphere named "sun" at (0,0,0)',
            'place large blue pyramid named "marker" at (100,0,100)'
        ]
    },

    /**
     * Validate command arguments
     * @param {Object} parsed - Parsed command
     * @returns {Object} Validation result
     */
    validate(parsed) {
        const pos = parsed.positional;

        if (pos.length < 3) {
            return {
                valid: false,
                error: 'Missing required arguments. Expected: place <size> <color> <shape> named "<name>" at (x,y,z)'
            };
        }

        // Find 'named' keyword
        let nameIndex = -1;
        let atIndex = -1;

        for (let i = 0; i < pos.length; i++) {
            const val = commandParser.getString(pos[i]).toLowerCase();
            if (val === 'named') nameIndex = i;
            if (val === 'at') atIndex = i;
        }

        if (nameIndex === -1) {
            return { valid: false, error: 'Missing "named" keyword. Expected: place ... named "<name>" at (x,y,z)' };
        }

        if (atIndex === -1) {
            return { valid: false, error: 'Missing "at" keyword. Expected: place ... at (x,y,z)' };
        }

        // Check for name after 'named'
        if (nameIndex + 1 >= pos.length || nameIndex + 1 === atIndex) {
            return { valid: false, error: 'Missing object name after "named"' };
        }

        // Check for coordinates after 'at'
        if (atIndex + 1 >= pos.length) {
            return { valid: false, error: 'Missing coordinates after "at"' };
        }

        const coordValue = pos[atIndex + 1];
        if (coordValue.type !== 'coordinate') {
            return { valid: false, error: 'Invalid coordinates. Use format: (x,y,z)' };
        }

        // Extract and validate size, color, shape
        const size = commandParser.getString(pos[0]).toLowerCase();
        const color = commandParser.getString(pos[1]).toLowerCase();
        const shape = commandParser.getString(pos[2]).toLowerCase();

        if (!['small', 'medium', 'large'].includes(size)) {
            return { valid: false, error: `Invalid size: ${size}. Use: small, medium, or large` };
        }

        if (!ColorUtils.isValidColor(color)) {
            return { valid: false, error: `Invalid color: ${color}. Available: ${ColorUtils.getAvailableColors().slice(0, 10).join(', ')}...` };
        }

        if (!ShapeFactory.isValidShape(shape)) {
            return { valid: false, error: `Invalid shape: ${shape}. Available: ${ShapeFactory.getAvailableShapes().join(', ')}` };
        }

        return { valid: true };
    },

    /**
     * Execute the command
     * @param {Object} parsed - Parsed command
     * @param {Object} context - Execution context
     * @returns {Object} Result
     */
    execute(parsed, context) {
        const { arena, statusPanel } = context;
        const pos = parsed.positional;

        // Find keyword indices
        let nameIndex = -1;
        let atIndex = -1;

        for (let i = 0; i < pos.length; i++) {
            const val = commandParser.getString(pos[i]).toLowerCase();
            if (val === 'named') nameIndex = i;
            if (val === 'at') atIndex = i;
        }

        // Extract values
        const size = commandParser.getString(pos[0]).toLowerCase();
        const color = commandParser.getString(pos[1]).toLowerCase();
        const shape = commandParser.getString(pos[2]).toLowerCase();
        const name = commandParser.getString(pos[nameIndex + 1]);
        const coords = pos[atIndex + 1];

        // Check if name already exists
        if (objectRegistry.has(name)) {
            return {
                success: false,
                error: `Object "${name}" already exists`
            };
        }

        // Create the object
        const object = ShapeFactory.createObject({
            name: name,
            shape: shape,
            color: color,
            size: size,
            position: { x: coords.x, y: coords.y, z: coords.z }
        });

        // Add to registry and scene
        objectRegistry.add(object);
        arena.addMesh(object.mesh);

        statusPanel.success(`Created ${size} ${color} ${shape} "${name}" at (${coords.x}, ${coords.y}, ${coords.z})`);

        return {
            success: true,
            object: object
        };
    }
};
