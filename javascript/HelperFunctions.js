function convertCards(cards) {
    const suitMap = { '♥': 'h', '♦': 'd', '♠': 's', '♣': 'c' };

    return cards.map(card => {
        let rank = card.slice(0, -1); // Get the rank
        let suit = suitMap[card.slice(-1)]; // Convert suit

        if (rank === "10") rank = "T"; // Replace 10 with T

        return `${rank}${suit}`;
    });
}

function updateDisplay() {
    // Updating the display with current state
}