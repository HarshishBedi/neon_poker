// ============================================================
// Data Handling & Analytics
// ============================================================

window.logEvent = function (eventName, details = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[Analytics] ${timestamp} | ${eventName}`, details);
    // TODO: Replace console.log with actual logging to server or local storage
};

window.initDataHandling = function () {
    // Placeholder: initialize any persistent storage or analytics service here
};

// Initialize on load
window.initDataHandling();
