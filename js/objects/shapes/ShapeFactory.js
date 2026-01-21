/**
 * Factory for creating shape meshes
 */
const ShapeFactory = {
    // Registered shape creators
    shapes: {
        sphere: SphereShape,
        cube: CubeShape,
        pyramid: PyramidShape
    },

    /**
     * Create a shape mesh
     * @param {string} shape - Shape type
     * @param {Object} options - Shape options (size, color)
     * @returns {THREE.Mesh}
     */
    create(shape, options) {
        const shapeLower = shape.toLowerCase();
        const creator = this.shapes[shapeLower];

        if (!creator) {
            throw new Error(`Unknown shape: ${shape}. Available: ${this.getAvailableShapes().join(', ')}`);
        }

        return creator.create(options);
    },

    /**
     * Register a new shape creator
     * @param {string} name - Shape name
     * @param {Object} creator - Creator with create(options) method
     */
    register(name, creator) {
        this.shapes[name.toLowerCase()] = creator;
    },

    /**
     * Get list of available shapes
     * @returns {string[]}
     */
    getAvailableShapes() {
        return Object.keys(this.shapes);
    },

    /**
     * Check if a shape is valid
     * @param {string} shape
     * @returns {boolean}
     */
    isValidShape(shape) {
        return this.shapes.hasOwnProperty(shape.toLowerCase());
    },

    /**
     * Create a SimObject with mesh
     * @param {Object} options - Object options
     * @returns {SimObject}
     */
    createObject(options) {
        const object = new SimObject(options);
        const mesh = this.create(options.shape, {
            size: object.size,
            color: options.color
        });
        object.setMesh(mesh);
        return object;
    }
};
