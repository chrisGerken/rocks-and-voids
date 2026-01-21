/**
 * Orbit behavior - object orbits around a target object
 */
class OrbitBehavior extends Behavior {
    constructor(options = {}) {
        super(options);
        this.targetName = options.target;
        this.period = options.period || 10;  // Orbital period in seconds
        this.angle = 0;  // Current angle in radians
        this.radius = null;  // Calculated from initial position
        this.orbitPlane = options.plane || 'xz';  // 'xz' (horizontal) or 'xy' or 'yz'
        this.centerY = null;  // Y position to maintain during orbit
    }

    /**
     * Calculate initial orbit parameters when attached
     * @param {SimObject} object
     */
    onAttach(object) {
        const target = objectRegistry.get(this.targetName);
        if (!target) {
            console.warn(`Orbit target "${this.targetName}" not found`);
            return;
        }

        // Calculate radius from initial position
        this.radius = object.position.distanceTo(target.position);

        // Calculate initial angle based on current position relative to target
        const dx = object.position.x - target.position.x;
        const dz = object.position.z - target.position.z;
        this.angle = Math.atan2(dz, dx);

        // Store Y position to maintain
        this.centerY = object.position.y;
    }

    /**
     * Update position along orbital path
     * @param {SimObject} object
     * @param {number} deltaTime
     */
    update(object, deltaTime) {
        const target = objectRegistry.get(this.targetName);
        if (!target) {
            return;
        }

        // Calculate angular velocity: 2*PI / period (radians per second)
        const angularVelocity = (2 * Math.PI) / this.period;
        this.angle += angularVelocity * deltaTime;

        // Keep angle in reasonable range
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        }

        // Store previous position for velocity calculation
        const previousPosition = object.position.clone();

        // Calculate new position based on orbit plane
        if (this.orbitPlane === 'xz') {
            // Horizontal orbit (default)
            object.position.x = target.position.x + this.radius * Math.cos(this.angle);
            object.position.z = target.position.z + this.radius * Math.sin(this.angle);
            // Keep Y constant or match target Y
            object.position.y = this.centerY !== null ? this.centerY : target.position.y;
        } else if (this.orbitPlane === 'xy') {
            object.position.x = target.position.x + this.radius * Math.cos(this.angle);
            object.position.y = target.position.y + this.radius * Math.sin(this.angle);
        } else if (this.orbitPlane === 'yz') {
            object.position.y = target.position.y + this.radius * Math.cos(this.angle);
            object.position.z = target.position.z + this.radius * Math.sin(this.angle);
        }

        // Calculate velocity from position change
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
            type: 'orbit',
            target: this.targetName,
            period: this.period,
            radius: this.radius,
            plane: this.orbitPlane
        };
    }
}
