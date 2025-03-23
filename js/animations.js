// ============================================================
// Animations & Audio Effects
// ============================================================

// Audio assets
window.chipsSound = new Audio("sounds/chips.mp3");
window.tickSound = new Audio("sounds/tick.mp3");

// Play chip sound
window.playChipsSound = function () {
    window.chipsSound.currentTime = 0;
    window.chipsSound.play().catch(err => console.error("Audio error:", err));
};

// Play tick sound
window.playTickSound = function () {
    window.tickSound.currentTime = 0;
    window.tickSound.play().catch(err => console.error("Audio error:", err));
};

// Update Call button text logic (shared between betting & wheel)
window.updateCallButton = function (value) {
    const callButton = document.getElementById("call-button");
    let selectedAmount = parseInt(value.replace("$", ""));
    let requiredCall = window.currentPlayer === 1
        ? window.player2TotalBet - window.player1TotalBet
        : window.player1TotalBet - window.player2TotalBet;
    requiredCall = Math.max(requiredCall, 0);
    selectedAmount = Math.max(selectedAmount, requiredCall);
    callButton.setAttribute("data-selected", `$${selectedAmount}`);
    callButton.setAttribute("value", `$${selectedAmount}`);
    callButton.textContent = requiredCall > 0
        ? (selectedAmount === requiredCall ? `Call - $${selectedAmount}` : `Raise - $${selectedAmount}`)
        : (selectedAmount > 0 ? `Bet - $${selectedAmount}` : "Bet");
};

window.updateBetButtonsUI = function () {
    const requiredCall = Math.max(
        window.currentPlayer === 1
            ? window.player2TotalBet - window.player1TotalBet
            : window.player1TotalBet - window.player2TotalBet,
        0
    );
    const checkButton = document.getElementById("check-button");
    if (requiredCall === 0) checkButton.removeAttribute('disabled');
    else checkButton.setAttribute('disabled', true);
    const currentSelection = document.getElementById("call-button").getAttribute("data-selected") || "$10";
    window.updateCallButton(currentSelection);
};

window.initAnimations = function () {
    // Placeholder for any future animation initialization (CSS transitions, card flips, etc.)
};

// Automatically initialize
window.initAnimations();