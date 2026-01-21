/**
 * UI Manager - coordinates all UI panels
 */
class UIManager {
    constructor() {
        this.renderPanel = null;
        this.statusPanel = null;
        this.commandPanel = null;
        this.arena = null;
    }

    /**
     * Initialize all UI components
     */
    init() {
        // Create render panel (three.js)
        this.renderPanel = new RenderPanel();

        // Initialize arena
        this.arena = this.renderPanel.initArena();

        // Create status panel
        this.statusPanel = new StatusPanel();

        // Create command panel
        this.commandPanel = new CommandPanel(this.statusPanel);

        // Set up simulation
        simulation.setRenderPanel(this.renderPanel);

        // Create execution context
        const context = {
            arena: this.arena,
            statusPanel: this.statusPanel,
            commandPanel: this.commandPanel,
            renderPanel: this.renderPanel,
            simulation: simulation,
            commandRegistry: commandRegistry
        };

        // Set context for command panel
        this.commandPanel.setContext(context);

        // Focus command input
        this.commandPanel.focus();

        // Display welcome message
        this.showWelcome();

        // Initial render
        this.renderPanel.render();

        return context;
    }

    /**
     * Show welcome message
     */
    showWelcome() {
        this.statusPanel.info('Welcome to Rocks and Voids');
        this.statusPanel.info('Type "help" for available commands');
        this.statusPanel.info('');
    }

    /**
     * Get render panel
     * @returns {RenderPanel}
     */
    getRenderPanel() {
        return this.renderPanel;
    }

    /**
     * Get status panel
     * @returns {StatusPanel}
     */
    getStatusPanel() {
        return this.statusPanel;
    }

    /**
     * Get command panel
     * @returns {CommandPanel}
     */
    getCommandPanel() {
        return this.commandPanel;
    }

    /**
     * Get arena
     * @returns {Arena}
     */
    getArena() {
        return this.arena;
    }
}

// Global UI manager instance
const uiManager = new UIManager();
