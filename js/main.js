/**
 * Rocks and Voids - Main Entry Point
 *
 * A client-side 3D graphics simulation where objects move according to defined behaviors.
 */

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize UI and get execution context
        const context = uiManager.init();

        // Store context globally for debugging
        window.rocksAndVoids = {
            context: context,
            objectRegistry: objectRegistry,
            simulation: simulation,
            commandRegistry: commandRegistry,
            behaviorManager: behaviorManager,
            Config: Config
        };

        console.log('Rocks and Voids initialized');
        console.log('Type commands in the command panel or access window.rocksAndVoids for debugging');

    } catch (error) {
        console.error('Failed to initialize Rocks and Voids:', error);

        // Show error in UI if possible
        const statusMessages = document.getElementById('status-messages');
        if (statusMessages) {
            statusMessages.innerHTML = `
                <div class="status-message error">
                    Failed to initialize: ${error.message}
                </div>
                <div class="status-message info">
                    Please check the browser console for details.
                </div>
            `;
        }
    }
});
