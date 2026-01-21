/**
 * Default configuration values for Rocks and Voids
 */
const Config = {
    // Arena settings
    arena: {
        size: 1000,          // Default arena size in meters (cube)
        backgroundColor: 0x000011  // Dark blue-black
    },

    // Simulation settings
    simulation: {
        frameTime: 0.1       // Default frame time in seconds (10 FPS for physics)
    },

    // Object size settings
    objects: {
        baseSize: 10,        // Medium size in meters
        sizeMultipliers: {
            small: 0.25,     // 25% of base
            medium: 1.0,     // Base size
            large: 2.0       // 200% of base
        }
    },

    // Camera settings
    camera: {
        fov: 75,             // Field of view in degrees
        near: 0.1,           // Near clipping plane
        far: 10000,          // Far clipping plane (enough for 1000m arena)
        defaultPosition: { x: 0, y: 50, z: 100 }
    },

    // Lighting settings
    lighting: {
        ambient: {
            color: 0x404040,  // Soft gray ambient light
            intensity: 0.5
        },
        defaultPointLight: {
            intensity: 1.0,
            distance: 500,    // Light reach
            decay: 2          // Realistic light falloff
        }
    }
};

// Freeze to prevent accidental modification
Object.freeze(Config);
Object.freeze(Config.arena);
Object.freeze(Config.simulation);
Object.freeze(Config.objects);
Object.freeze(Config.objects.sizeMultipliers);
Object.freeze(Config.camera);
Object.freeze(Config.camera.defaultPosition);
Object.freeze(Config.lighting);
Object.freeze(Config.lighting.ambient);
Object.freeze(Config.lighting.defaultPointLight);
