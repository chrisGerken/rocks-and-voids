/**
 * Manager for object behaviors
 */
class BehaviorManager {
    constructor() {
        // Registered behavior types
        this.behaviorTypes = {
            'still': StillBehavior,
            'orbits': OrbitBehavior,
            'follows': FollowBehavior
        };
    }

    /**
     * Create and assign a behavior to an object
     * @param {string} objectName - Name of the object
     * @param {string} behaviorType - Type of behavior
     * @param {Object} options - Behavior options
     * @returns {Behavior}
     */
    assignBehavior(objectName, behaviorType, options = {}) {
        const object = objectRegistry.get(objectName);
        if (!object) {
            throw new Error(`Object not found: ${objectName}`);
        }

        const BehaviorClass = this.behaviorTypes[behaviorType.toLowerCase()];
        if (!BehaviorClass) {
            throw new Error(`Unknown behavior: ${behaviorType}. Available: ${this.getAvailableBehaviors().join(', ')}`);
        }

        const behavior = new BehaviorClass(options);
        object.setBehavior(behavior);

        eventBus.emit('behavior:assigned', {
            object: objectName,
            behavior: behaviorType,
            options: options
        });

        return behavior;
    }

    /**
     * Remove behavior from an object
     * @param {string} objectName
     */
    removeBehavior(objectName) {
        const object = objectRegistry.get(objectName);
        if (object) {
            object.setBehavior(null);
            eventBus.emit('behavior:removed', { object: objectName });
        }
    }

    /**
     * Register a new behavior type
     * @param {string} name
     * @param {Function} BehaviorClass
     */
    registerBehavior(name, BehaviorClass) {
        this.behaviorTypes[name.toLowerCase()] = BehaviorClass;
    }

    /**
     * Get list of available behavior types
     * @returns {string[]}
     */
    getAvailableBehaviors() {
        return Object.keys(this.behaviorTypes);
    }

    /**
     * Check if a behavior type is valid
     * @param {string} type
     * @returns {boolean}
     */
    isValidBehavior(type) {
        return this.behaviorTypes.hasOwnProperty(type.toLowerCase());
    }

    /**
     * Update all objects with behaviors
     * @param {number} deltaTime
     */
    updateAll(deltaTime) {
        objectRegistry.forEach(object => {
            object.update(deltaTime);
        });

        // Also update camera
        const camera = objectRegistry.getCamera();
        if (camera) {
            camera.update(deltaTime);
        }
    }
}

// Global behavior manager instance
const behaviorManager = new BehaviorManager();
