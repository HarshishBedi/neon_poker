// ===============================================
// Basic AI Logic for Computer Player
// ===============================================

window.runComputerTurn = function () {
    if (window.currentPlayer !== 2) return;

    const delay = 1500; // Simulate thinking delay

    setTimeout(() => {
        const canCheck = (window.player1TotalBet === window.player2TotalBet);
        // const canRaise = window.player2Chips >= 20;
        const hasGlitch = window.player2Cards.includes("GLITCH");
        console.log('window.player2Cards =', window.player2Cards)

        // RANDOMIZED: 50% chance to use glitch if river exists
        if (window.communityCards.length === 5 && hasGlitch && Math.random() < 0.5) {
            window.useGlitch(2);
            console.log("Computer used Glitch card!");
            // Remove glitch card after using
            window.player2Cards = window.player2Cards.filter(c => c !== "GLITCH");
            window.updateDisplay();
            return; // End turn after glitch usage
        }

        if (canCheck && Math.random() < 0.5) {
            console.log("Computer chooses to check");
            window.check();
        } else {
            // Random raise or call logic
            let callAmount = window.player1TotalBet - window.player2TotalBet;
            if (callAmount < 0) callAmount = 0;

            let baseBet = 10 + Math.floor(Math.random() * 40);
            let finalBet = Math.max(callAmount, baseBet);
            if (finalBet > window.player2Chips) finalBet = window.player2Chips;

            document.getElementById("call-button").setAttribute("value", "$" + finalBet);
            console.log("Computer bets: $" + finalBet);
            window.placeBet();
        }
    }, delay);
};
