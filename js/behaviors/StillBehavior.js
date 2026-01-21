/**
 * Still behavior - object remains stationary
 */
class StillBehavior extends Behavior {
    constructor(options = {}) {
        super(options);
    }

    /**
     * No movement - just zero out velocity
     * @param {SimObject} object
     * @param {number} deltaTime
     */
    update(object, deltaTime) {
        object.velocity.set(0, 0, 0);
    }
}
