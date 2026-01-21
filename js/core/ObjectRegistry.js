/**
 * Registry for named simulation objects
 */
class ObjectRegistry {
    constructor() {
        this.objects = new Map();
        this.camera = null;
    }

    /**
     * Add an object to the registry
     * @param {SimObject} object
     */
    add(object) {
        if (this.objects.has(object.name)) {
            throw new Error(`Object with name "${object.name}" already exists`);
        }
        this.objects.set(object.name, object);
        eventBus.emit('object:added', object);
    }

    /**
     * Get an object by name
     * @param {string} name
     * @returns {SimObject|undefined}
     */
    get(name) {
        return this.objects.get(name);
    }

    /**
     * Check if an object exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.objects.has(name);
    }

    /**
     * Remove an object by name
     * @param {string} name
     * @returns {SimObject|undefined} The removed object
     */
    remove(name) {
        const object = this.objects.get(name);
        if (object) {
            this.objects.delete(name);
            eventBus.emit('object:removed', object);
        }
        return object;
    }

    /**
     * Set the camera object
     * @param {Camera} camera
     */
    setCamera(camera) {
        this.camera = camera;
        eventBus.emit('camera:set', camera);
    }

    /**
     * Get the camera object
     * @returns {Camera|null}
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Check if a camera has been defined
     * @returns {boolean}
     */
    hasCamera() {
        return this.camera !== null;
    }

    /**
     * Iterate over all objects
     * @param {Function} callback - Called with (object, name)
     */
    forEach(callback) {
        this.objects.forEach((object, name) => callback(object, name));
    }

    /**
     * Get all objects as an array
     * @returns {SimObject[]}
     */
    getAll() {
        return Array.from(this.objects.values());
    }

    /**
     * Get all object names
     * @returns {string[]}
     */
    getNames() {
        return Array.from(this.objects.keys());
    }

    /**
     * Get count of objects (excluding camera)
     * @returns {number}
     */
    count() {
        return this.objects.size;
    }

    /**
     * Clear all objects
     */
    clear() {
        this.objects.forEach(object => {
            if (object.dispose) {
                object.dispose();
            }
        });
        this.objects.clear();

        if (this.camera && this.camera.dispose) {
            this.camera.dispose();
        }
        this.camera = null;

        eventBus.emit('registry:cleared');
    }
}

// Global registry instance
const objectRegistry = new ObjectRegistry();
