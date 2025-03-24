window.useNEURAL_BLUFF = function () {
    if (window.usedJokerThisHand) return;

    console.log("Neural Bluff: Forcing opponent to reveal a card...");

    // Flag which card (0 or 1) of Player 2 should be shown
    window.revealedOpponentCardIndex = Math.floor(Math.random() * 2);

    window.usedJokerThisHand = "NEURAL_BLUFF";
    window.playJokerSound("NEURAL_BLUFF");
    window.updateDisplay();
};