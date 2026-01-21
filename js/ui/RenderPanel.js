/**
 * Render panel - three.js canvas management
 */
class RenderPanel {
    constructor() {
        this.container = document.getElementById('render-panel');
        this.canvas = document.getElementById('render-canvas');

        // Create three.js renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(Config.arena.backgroundColor);

        // Arena (created after scene)
        this.arena = null;

        // Handle resize
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Initialize arena
     * @returns {Arena}
     */
    initArena() {
        this.arena = new Arena(this.scene);
        return this.arena;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.renderer.setSize(width, height);

        // Update camera aspect ratio if camera exists
        const camera = objectRegistry.getCamera();
        if (camera) {
            camera.setAspectRatio(width / height);
        }
    }

    /**
     * Render the scene
     */
    render() {
        const camera = objectRegistry.getCamera();
        if (camera) {
            this.renderer.render(this.scene, camera.getThreeCamera());
        }
    }

    /**
     * Get the three.js scene
     * @returns {THREE.Scene}
     */
    getScene() {
        return this.scene;
    }

    /**
     * Get the arena
     * @returns {Arena}
     */
    getArena() {
        return this.arena;
    }

    /**
     * Take a screenshot
     * @returns {string} Data URL of the screenshot
     */
    screenshot() {
        this.render();
        return this.canvas.toDataURL('image/png');
    }
}
