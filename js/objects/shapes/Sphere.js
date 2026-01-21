/**
 * Sphere shape creator
 */
const SphereShape = {
    /**
     * Create a sphere mesh
     * @param {Object} options - Shape options
     * @returns {THREE.Mesh}
     */
    create(options) {
        // Sphere radius is half the size (size = diameter/height)
        const radius = options.size / 2;

        // Higher segment count for smoother appearance
        const geometry = new THREE.SphereGeometry(radius, 32, 32);

        const material = new THREE.MeshStandardMaterial({
            color: ColorUtils.toHex(options.color),
            roughness: 0.7,
            metalness: 0.3
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }
};
