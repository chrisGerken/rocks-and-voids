/**
 * Follow behavior - object follows a target while maintaining minimum distance
 */
class FollowBehavior extends Behavior {
    constructor(options = {}) {
        super(options);
        this.targetName = options.target;
        this.minDistance = options.distance || 10;  // Minimum distance to maintain
        this.speed = options.speed || 50;  // Units per second when moving
    }

    /**
     * Update position to follow target
     * @param {SimObject} object
     * @param {number} deltaTime
     */
    update(object, deltaTime) {
        const target = objectRegistry.get(this.targetName);
        if (!target) {
            object.velocity.set(0, 0, 0);
            return;
        }

        // Calculate distance to target
        const distance = object.position.distanceTo(target.position);

        // If within minimum distance, stop
        if (distance <= this.minDistance) {
            object.velocity.set(0, 0, 0);
            return;
        }

        // Calculate direction to target
        const direction = new THREE.Vector3()
            .subVectors(target.position, object.position)
            .normalize();

        // Calculate how far to move this frame
        const moveDistance = Math.min(this.speed * deltaTime, distance - this.minDistance);

        // Store previous position for velocity
        const previousPosition = object.position.clone();

        // Move toward target
        object.position.add(direction.multiplyScalar(moveDistance));

        // Calculate velocity
        object.velocity.subVectors(object.position, previousPosition);
        if (deltaTime > 0) {
            object.velocity.divideScalar(deltaTime);
        }
    }

    /**
     * Get behavior info
     * @returns {Object}
     */
    getInfo() {
        return {
            type: 'follow',
            target: this.targetName,
            distance: this.minDistance,
            speed: this.speed
        };
    }
}
