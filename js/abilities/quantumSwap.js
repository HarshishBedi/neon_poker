window.useQuantumSwap = function (player) {
    // Swap one non-GLITCH hole card with the top card of the deck
    const hand = player === 1 ? window.player1Cards : window.player2Cards;
    const validIndexes = hand.map((card, i) => card !== "GLITCH" ? i : -1).filter(i => i !== -1);
    if (validIndexes.length === 0) {
        alert("No valid card to swap!");
        return;
    }
    if (!window.deck.length) {
        alert("Deck is empty, cannot swap!");
        return;
    }
    const indexToSwap = validIndexes[Math.floor(Math.random() * validIndexes.length)];
    const newCard = window.deck.pop();
    const oldCard = hand[indexToSwap];
    hand[indexToSwap] = newCard;
    alert(`Player ${player} swapped ${oldCard} for ${newCard}`);
    window.updateDisplay();
};