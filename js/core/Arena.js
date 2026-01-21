/**
 * Arena - manages the 3D space, boundaries, and ambient lighting
 */
class Arena {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.size = options.size || Config.arena.size;

        this.setupLighting();
        this.setupBoundary();
    }

    /**
     * Set up ambient lighting
     */
    setupLighting() {
        // Ambient light for base visibility
        this.ambientLight = new THREE.AmbientLight(
            Config.lighting.ambient.color,
            Config.lighting.ambient.intensity
        );
        this.scene.add(this.ambientLight);

        // Directional light for better object visibility
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(100, 200, 100);
        this.scene.add(this.directionalLight);

        // Secondary directional light from opposite side
        this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        this.directionalLight2.position.set(-100, 100, -100);
        this.scene.add(this.directionalLight2);
    }

    /**
     * Set up visual boundary indicators (optional wireframe cube)
     */
    setupBoundary() {
        const halfSize = this.size / 2;

        // Create wireframe cube to show arena bounds
        const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({
            color: 0x334455,
            transparent: true,
            opacity: 0.3
        });

        this.boundaryMesh = new THREE.LineSegments(edges, material);
        this.boundaryMesh.position.set(0, 0, 0);
        this.scene.add(this.boundaryMesh);

        // Add subtle grid on the floor (y=0 plane)
        const gridHelper = new THREE.GridHelper(this.size, 20, 0x222233, 0x111122);
        gridHelper.position.y = -halfSize;
        this.gridHelper = gridHelper;
        this.scene.add(gridHelper);
    }

    /**
     * Check if a position is within arena bounds
     * @param {THREE.Vector3} position
     * @returns {boolean}
     */
    isInBounds(position) {
        const halfSize = this.size / 2;
        return Math.abs(position.x) <= halfSize &&
               Math.abs(position.y) <= halfSize &&
               Math.abs(position.z) <= halfSize;
    }

    /**
     * Clamp a position to arena bounds
     * @param {THREE.Vector3} position
     * @returns {THREE.Vector3}
     */
    clampToBounds(position) {
        const halfSize = this.size / 2;
        return new THREE.Vector3(
            Math.max(-halfSize, Math.min(halfSize, position.x)),
            Math.max(-halfSize, Math.min(halfSize, position.y)),
            Math.max(-halfSize, Math.min(halfSize, position.z))
        );
    }

    /**
     * Update arena size
     * @param {number} newSize
     */
    setSize(newSize) {
        this.size = newSize;

        // Remove old boundary
        this.scene.remove(this.boundaryMesh);
        this.scene.remove(this.gridHelper);

        // Recreate boundary with new size
        this.setupBoundary();

        eventBus.emit('arena:resized', { size: newSize });
    }

    /**
     * Get the arena center
     * @returns {THREE.Vector3}
     */
    getCenter() {
        return new THREE.Vector3(0, 0, 0);
    }

    /**
     * Get arena bounds
     * @returns {Object}
     */
    getBounds() {
        const halfSize = this.size / 2;
        return {
            min: new THREE.Vector3(-halfSize, -halfSize, -halfSize),
            max: new THREE.Vector3(halfSize, halfSize, halfSize),
            size: this.size
        };
    }

    /**
     * Add a light to the scene
     * @param {THREE.Light} light
     */
    addLight(light) {
        this.scene.add(light);
    }

    /**
     * Remove a light from the scene
     * @param {THREE.Light} light
     */
    removeLight(light) {
        this.scene.remove(light);
    }

    /**
     * Add a mesh to the scene
     * @param {THREE.Mesh} mesh
     */
    addMesh(mesh) {
        this.scene.add(mesh);
    }

    /**
     * Remove a mesh from the scene
     * @param {THREE.Mesh} mesh
     */
    removeMesh(mesh) {
        this.scene.remove(mesh);
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.scene.remove(this.ambientLight);
        this.scene.remove(this.boundaryMesh);
        this.scene.remove(this.gridHelper);
    }
}
