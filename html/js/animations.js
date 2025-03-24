// ============================================================
// Animations & Audio Effects
// ============================================================

// Audio assets
window.chipsSound = new Audio("sounds/chips.mp3");
window.tickSound = new Audio("sounds/tick.mp3");

// Play chip sound
window.playChipsSound = function () {
    window.chipsSound.currentTime = 0;
    window.chipsSound.play().catch(err => console.error("Audio error:", err));
};

// Play tick sound
window.playTickSound = function () {
    window.tickSound.currentTime = 0;
    window.tickSound.play().catch(err => console.error("Audio error:", err));
};

window.initAnimations = function () {
    // Placeholder for any future animation initialization (CSS transitions, card flips, etc.)
};

// Automatically initialize
window.initAnimations();