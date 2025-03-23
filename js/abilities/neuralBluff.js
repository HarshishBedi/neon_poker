window.useNeuralBluff = function (player) {
    // Reveal a random non-GLITCH card from the opponent’s hand
    const opponentCards = player === 1 ? window.player2Cards : window.player1Cards;
    const revealable = opponentCards.filter(card => card !== "GLITCH");
    if (!revealable.length) {
        alert("No valid card to reveal!");
        return;
    }
    const card = revealable[Math.floor(Math.random() * revealable.length)];
    alert(`Player ${player === 1 ? 2 : 1} reveals: ${card}`);
};
