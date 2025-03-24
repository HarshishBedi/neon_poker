window.useQUANTUM_SWAP = function () {
    if (window.usedJokerThisHand) return;
    console.log("Used Quantum Swap: Swapping one of Player 1’s cards.");
    if (window.player1Cards.length > 0) {
        const index = Math.floor(Math.random() * window.player1Cards.length);
        const oldCard = window.player1Cards[index];
        let newCard;
        do {
            newCard = window.deck.pop();
        } while (window.player1Cards.includes(newCard) || window.communityCards.includes(newCard));

        window.player1Cards[index] = newCard;
        window.usedJokerThisHand = "QUANTUM_SWAP";
        window.playJokerSound("QUANTUM_SWAP");
        window.updateDisplay();
    }
};