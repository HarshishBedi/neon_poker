// ============================================================
// Responsive Design & Layout Adjustments
// ============================================================

window.initResponsive = function () {
    function adjustLayout() {
        const width = window.innerWidth;
        const root = document.documentElement;
        if (width < 600) {
            root.classList.add('mobile');
            root.classList.remove('desktop');
        } else {
            root.classList.add('desktop');
            root.classList.remove('mobile');
        }
    }
    window.addEventListener('resize', adjustLayout);
    adjustLayout();
};

// Initialize on load
window.initResponsive();