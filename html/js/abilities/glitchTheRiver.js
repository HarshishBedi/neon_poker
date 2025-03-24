window.useGLITCH = function () {
    if (window.communityCards.length === 5) {
        console.log("Used Glitch: Replacing river card.");
        window.communityCards[4] = window.deck.pop();
        window.usedJokerThisHand = "GLITCH";
        window.playJokerSound("GLITCH");
        window.updateDisplay();
    } else {
        alert("Glitch can only be used after the river is revealed.");
    }
};