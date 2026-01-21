/**
 * Status panel - displays messages, errors, and help
 */
class StatusPanel {
    constructor() {
        this.container = document.getElementById('status-messages');
        this.maxMessages = 100;
    }

    /**
     * Add a message to the status panel
     * @param {string} text - Message text
     * @param {string} type - Message type (info, success, error, warning, help)
     */
    addMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `status-message ${type}`;
        message.textContent = text;

        this.container.appendChild(message);

        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;

        // Trim old messages
        while (this.container.children.length > this.maxMessages) {
            this.container.removeChild(this.container.firstChild);
        }

        return message;
    }

    /**
     * Add info message
     * @param {string} text
     */
    info(text) {
        this.addMessage(text, 'info');
    }

    /**
     * Add success message
     * @param {string} text
     */
    success(text) {
        this.addMessage(text, 'success');
    }

    /**
     * Add error message
     * @param {string} text
     */
    error(text) {
        this.addMessage(text, 'error');
    }

    /**
     * Add warning message
     * @param {string} text
     */
    warning(text) {
        this.addMessage(text, 'warning');
    }

    /**
     * Add help message (preformatted)
     * @param {string} text
     */
    help(text) {
        const message = document.createElement('div');
        message.className = 'status-message help';

        // Create pre element for formatted text
        const pre = document.createElement('pre');
        pre.style.margin = '0';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.fontFamily = 'inherit';
        pre.textContent = text;

        message.appendChild(pre);
        this.container.appendChild(message);

        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;

        // Trim old messages
        while (this.container.children.length > this.maxMessages) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    /**
     * Clear all messages
     */
    clear() {
        this.container.innerHTML = '';
    }
}
