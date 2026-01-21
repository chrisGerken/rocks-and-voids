/**
 * Pyramid (tetrahedron) shape creator
 */
const PyramidShape = {
    /**
     * Create a pyramid mesh
     * @param {Object} options - Shape options
     * @returns {THREE.Mesh}
     */
    create(options) {
        const size = options.size;

        // Create a cone geometry for a classic pyramid look
        // 4 radial segments gives a square base pyramid
        const radius = size * 0.6;  // Base radius
        const height = size;

        const geometry = new THREE.ConeGeometry(radius, height, 4);

        const material = new THREE.MeshStandardMaterial({
            color: ColorUtils.toHex(options.color),
            roughness: 0.7,
            metalness: 0.3,
            flatShading: true  // Emphasizes the pyramid faces
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Rotate to align one edge with Z axis for consistent orientation
        mesh.rotation.y = Math.PI / 4;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }
};
