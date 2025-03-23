window.useGlitch = function (player) {
    // Replace the river card if at least 5 community cards have been dealt
    if (window.communityCards.length < 5) {
        alert("The river card is not yet dealt!");
        return;
    }
    const newRiverCard = window.deck.pop();
    window.communityCards[window.communityCards.length - 1] = newRiverCard;
    // Remove the GLITCH card from the player's hand
    const hand = player === 1 ? window.player1Cards : window.player2Cards;
    const glitchIndex = hand.indexOf("GLITCH");
    if (glitchIndex > -1) hand.splice(glitchIndex, 1);
    window.updateDisplay();
    alert(`Player ${player} used Glitch! River card replaced with ${newRiverCard}`);
};
