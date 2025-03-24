// ===============================================
// Basic AI Logic for Computer Player
// ===============================================

window.runComputerTurn = function () {
    if (window.currentPlayer !== 2) return;

    const delay = 1500; // Simulate thinking delay
    const items = [
        "$10", "$20", "$30", "$40", "$50", "$60", "$70", "$80", "$90",
        "$100", "$110", "$120", "$130", "$140", "$150", "$160", "$170",
        "$180", "$190", "$200"
    ];

    setTimeout(() => {
        const canCheck = window.player1TotalBet === window.player2TotalBet;
        const hasGlitch = window.player2Cards.includes("GLITCH");
        const hand = Hand.solve(window.convertCards([...window.player2Cards, ...window.communityCards]));
        const strength = hand.rank; // higher is better (e.g., 10 = Royal Flush)
        console.log(strength, hand);

        // Use Glitch card 25% of the time on river if holding it
        if (window.communityCards.length === 5 && hasGlitch && Math.random() < 0.25) {
            window.useGlitch(2);
            console.log("Computer used Glitch card!");
            window.player2Cards = window.player2Cards.filter(c => c !== "GLITCH");
        }

        let actionTaken = false;

        if (strength >= 6) {
            // Strong hand: Raise with higher amount
            const highBet = items[Math.floor(Math.random() * (items.length - 5) + 5)];
            document.getElementById("call-button").setAttribute("value", "$" + highBet);
            console.log("Computer has a strong hand. Betting high:", highBet);
            window.placeBet();
            actionTaken = true;
        }

        if (!actionTaken && strength >= 4) {
            // Medium strength: Call or moderate bet
            const midBet = items[Math.floor(Math.random() * 10) + 5];
            const callAmount = window.player1TotalBet - window.player2TotalBet;
            const selectedBet = Math.max(parseInt(midBet.replace("$", "")), callAmount);
            document.getElementById("call-button").setAttribute("value", "$" + selectedBet);
            console.log("Computer has a decent hand. Betting:", selectedBet);
            window.placeBet();
            actionTaken = true;
        }

        if (!actionTaken && strength < 4) {
            const callAmount = window.player1TotalBet - window.player2TotalBet;

            if (canCheck) {
                console.log("Computer has a weak hand. Choosing to check.");
                window.check();
            } else if (callAmount <= 100 && callAmount <= window.player2Chips) {
                // Add a chance to fold even if within range, to keep it human-like
                const foldChance = strength <= 2 ? 0.25 : 0.1; // fold more often if super weak
                if (Math.random() < foldChance) {
                    console.log("Computer folds (by chance).");
                    window.fold();
                } else {
                    document.getElementById("call-button").setAttribute("value", "$" + callAmount);
                    console.log("Computer has weak hand but calling reasonable bet:", callAmount);
                    window.placeBet();
                }
            } else {
                console.log("Computer folds due to high bet.");
                window.fold();
            }
        }
    }, delay);
};
