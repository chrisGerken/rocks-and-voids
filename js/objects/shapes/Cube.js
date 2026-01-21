/**
 * Cube shape creator
 */
const CubeShape = {
    /**
     * Create a cube mesh
     * @param {Object} options - Shape options
     * @returns {THREE.Mesh}
     */
    create(options) {
        // Cube size (all sides equal to the height)
        const size = options.size;

        const geometry = new THREE.BoxGeometry(size, size, size);

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
