window.usePREDICTIVE_BET = function () {
    if (window.usedJokerThisHand) return;
    console.log("Used Predictive Bet: Evaluating hand...");

    const allCards = [...window.player1Cards, ...window.communityCards];
    const converted = window.convertCards(allCards);
    const hand = Hand.solve(converted);

    const rank = hand.rank; // 1 = High Card, 10 = Royal Flush
    let smartBet = 50;

    if (rank >= 9) {
        smartBet = 200; // Strong: Straight Flush, Royal Flush
    } else if (rank >= 7) {
        smartBet = 150; // Full House, Four of a Kind
    } else if (rank >= 5) {
        smartBet = 100; // Flush, Straight
    } else {
        smartBet = 50;  // Weaker hands
    }

    const betStr = `$${smartBet}`;
    const callBtn = document.getElementById("call-button");

    callBtn.setAttribute("data-selected", betStr);
    callBtn.setAttribute("value", betStr);
    window.updateCallButton(betStr);

    window.usedJokerThisHand = "PREDICTIVE_BET";
    window.placeBet();
    window.playJokerSound("PREDICTIVE_BET");
    window.updateDisplay();
};
