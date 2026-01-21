/**
 * Vector math utilities
 */
const VectorUtils = {
    /**
     * Create a THREE.Vector3 from coordinates
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {THREE.Vector3}
     */
    create(x, y, z) {
        return new THREE.Vector3(x, y, z);
    },

    /**
     * Create a THREE.Vector3 from an object with x, y, z properties
     * @param {Object} obj - Object with x, y, z properties
     * @returns {THREE.Vector3}
     */
    fromObject(obj) {
        return new THREE.Vector3(obj.x || 0, obj.y || 0, obj.z || 0);
    },

    /**
     * Calculate distance between two vectors
     * @param {THREE.Vector3} a
     * @param {THREE.Vector3} b
     * @returns {number}
     */
    distance(a, b) {
        return a.distanceTo(b);
    },

    /**
     * Calculate direction from a to b (normalized)
     * @param {THREE.Vector3} from
     * @param {THREE.Vector3} to
     * @returns {THREE.Vector3}
     */
    direction(from, to) {
        return new THREE.Vector3().subVectors(to, from).normalize();
    },

    /**
     * Linear interpolation between two vectors
     * @param {THREE.Vector3} a
     * @param {THREE.Vector3} b
     * @param {number} t - Interpolation factor (0-1)
     * @returns {THREE.Vector3}
     */
    lerp(a, b, t) {
        return new THREE.Vector3().lerpVectors(a, b, t);
    },

    /**
     * Parse coordinate string "(x,y,z)" to Vector3
     * @param {string} str - Coordinate string
     * @returns {THREE.Vector3|null}
     */
    parseCoordinate(str) {
        const match = str.match(/^\((-?[\d.]+),\s*(-?[\d.]+),\s*(-?[\d.]+)\)$/);
        if (match) {
            return new THREE.Vector3(
                parseFloat(match[1]),
                parseFloat(match[2]),
                parseFloat(match[3])
            );
        }
        return null;
    },

    /**
     * Format Vector3 as string "(x, y, z)"
     * @param {THREE.Vector3} vec
     * @param {number} decimals - Number of decimal places
     * @returns {string}
     */
    format(vec, decimals = 2) {
        return `(${vec.x.toFixed(decimals)}, ${vec.y.toFixed(decimals)}, ${vec.z.toFixed(decimals)})`;
    }
};
