/**
 * Base class for all simulation objects
 */
class SimObject {
    constructor(options) {
        this.name = options.name;
        this.shape = options.shape;
        this.color = options.color;
        this.sizeName = options.size || 'medium';

        // Calculate actual size in meters
        const multiplier = Config.objects.sizeMultipliers[this.sizeName] || 1.0;
        this.size = (options.baseSize || Config.objects.baseSize) * multiplier;

        // Position and velocity
        this.position = options.position ?
            VectorUtils.fromObject(options.position) :
            new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);

        // Three.js mesh (created by subclass or factory)
        this.mesh = null;

        // Behavior (movement pattern)
        this.behavior = null;

        // Light emission
        this.light = null;

        // Visibility
        this.visible = options.visible !== false;
    }

    /**
     * Set the three.js mesh
     * @param {THREE.Mesh} mesh
     */
    setMesh(mesh) {
        this.mesh = mesh;
        this.mesh.position.copy(this.position);
    }

    /**
     * Update object state
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        // Update behavior
        if (this.behavior) {
            this.behavior.update(this, deltaTime);
        }

        // Update light
        if (this.light) {
            this.light.update(deltaTime);
        }

        // Sync mesh position with object position
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }

    /**
     * Set object position
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }

    /**
     * Set object behavior
     * @param {Behavior} behavior
     */
    setBehavior(behavior) {
        // Detach old behavior
        if (this.behavior && this.behavior.onDetach) {
            this.behavior.onDetach(this);
        }

        this.behavior = behavior;

        // Attach new behavior
        if (behavior && behavior.onAttach) {
            behavior.onAttach(this);
        }
    }

    /**
     * Enable light emission
     * @param {Object} options - Light options
     */
    setLight(options) {
        if (this.light) {
            this.light.dispose();
        }
        this.light = new ObjectLight(this, options);
    }

    /**
     * Remove light emission
     */
    removeLight() {
        if (this.light) {
            this.light.dispose();
            this.light = null;
        }
    }

    /**
     * Get object info for status display
     * @returns {Object}
     */
    getInfo() {
        return {
            name: this.name,
            shape: this.shape,
            color: this.color,
            size: this.sizeName,
            position: VectorUtils.format(this.position),
            velocity: VectorUtils.format(this.velocity),
            behavior: this.behavior ? this.behavior.constructor.name : 'none',
            emitsLight: this.light !== null
        };
    }

    /**
     * Clean up resources
     */
    dispose() {
        if (this.mesh) {
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh.material) {
                this.mesh.material.dispose();
            }
        }
        if (this.light) {
            this.light.dispose();
        }
    }
}
