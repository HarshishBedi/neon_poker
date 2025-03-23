document.addEventListener("DOMContentLoaded", () => {
    // Initialize core game objects
    const game = new GameFlow(new GameUI(), new GameLogic());
    game.prepareGame();

    // Initialize helpers
    window.initInputHandlers();
    window.initResponsive();
    window.initAnimations();
    window.initDataHandling();

    // Optionally start game automatically
    // game.startGame();
});