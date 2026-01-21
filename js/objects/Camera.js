/**
 * Camera as a SimObject - can be positioned and have behaviors like other objects
 */
class SimCamera extends SimObject {
    constructor(options = {}) {
        super({
            name: options.name || 'camera',
            shape: 'camera',
            color: 'white',
            size: 'small',
            visible: false,
            ...options
        });

        // Set default position if not specified
        if (!options.position) {
            this.position.set(
                Config.camera.defaultPosition.x,
                Config.camera.defaultPosition.y,
                Config.camera.defaultPosition.z
            );
        }

        // Create three.js camera
        this.threeCamera = new THREE.PerspectiveCamera(
            Config.camera.fov,
            1,  // Aspect ratio set later by RenderPanel
            Config.camera.near,
            Config.camera.far
        );
        this.threeCamera.position.copy(this.position);

        // Look-at target (object name or Vector3)
        this.lookAtTarget = null;

        // Follow travel direction by default
        this.followTravelDirection = true;

        // Previous position for velocity calculation
        this.previousPosition = this.position.clone();
    }

    /**
     * Update camera
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Calculate velocity from position change
        this.velocity.subVectors(this.position, this.previousPosition).divideScalar(deltaTime || 0.001);
        this.previousPosition.copy(this.position);

        // Update behavior
        if (this.behavior) {
            this.behavior.update(this, deltaTime);
        }

        // Sync three.js camera position
        this.threeCamera.position.copy(this.position);

        // Handle look-at
        if (this.lookAtTarget) {
            const target = this.resolveLookAtTarget();
            if (target) {
                this.threeCamera.lookAt(target);
            }
        } else if (this.followTravelDirection && this.velocity.length() > 0.001) {
            // Look in direction of travel
            const lookPoint = this.position.clone().add(this.velocity.clone().normalize().multiplyScalar(100));
            this.threeCamera.lookAt(lookPoint);
        }
    }

    /**
     * Resolve look-at target to a Vector3
     * @returns {THREE.Vector3|null}
     */
    resolveLookAtTarget() {
        if (this.lookAtTarget instanceof THREE.Vector3) {
            return this.lookAtTarget;
        }

        if (typeof this.lookAtTarget === 'string') {
            const targetObject = objectRegistry.get(this.lookAtTarget);
            if (targetObject) {
                return targetObject.position;
            }
        }

        return null;
    }

    /**
     * Set camera position
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.threeCamera.position.copy(this.position);
    }

    /**
     * Set look-at target
     * @param {string|THREE.Vector3} target - Object name or position
     */
    setLookAt(target) {
        this.lookAtTarget = target;
        this.followTravelDirection = false;

        // Immediate update
        const targetPos = this.resolveLookAtTarget();
        if (targetPos) {
            this.threeCamera.lookAt(targetPos);
        }
    }

    /**
     * Clear look-at and resume following travel direction
     */
    clearLookAt() {
        this.lookAtTarget = null;
        this.followTravelDirection = true;
    }

    /**
     * Look at a specific position
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    lookAtPosition(x, y, z) {
        this.setLookAt(new THREE.Vector3(x, y, z));
    }

    /**
     * Set aspect ratio (called by RenderPanel on resize)
     * @param {number} aspect
     */
    setAspectRatio(aspect) {
        this.threeCamera.aspect = aspect;
        this.threeCamera.updateProjectionMatrix();
    }

    /**
     * Get the three.js camera for rendering
     * @returns {THREE.PerspectiveCamera}
     */
    getThreeCamera() {
        return this.threeCamera;
    }

    /**
     * Get camera info
     * @returns {Object}
     */
    getInfo() {
        const info = super.getInfo();
        info.lookAt = this.lookAtTarget || 'travel direction';
        return info;
    }

    /**
     * Clean up resources
     */
    dispose() {
        // Camera doesn't have geometry/material to dispose
    }
}
