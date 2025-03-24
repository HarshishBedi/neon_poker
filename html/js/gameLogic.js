// ============================================================
// Poker Game Logic & Betting Code
// ============================================================

window.GameLogic = class {
}

window.suits = ["♠", "♣", "♦", "♥"];
window.values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

window.deck = [];
window.player1Cards = [];
window.player2Cards = [];
window.communityCards = [];
window.jokerCards = [];

window.player1Chips = 1000;
window.player2Chips = 1000;
window.pot = 0;
window.currentPlayer = 1;

window.bettingRound = 0;
window.lastWinner = null;
window.player1TotalBet = 0;
window.player2TotalBet = 0;
window.smallBlind = 10;
window.bigBlind = 20;
window.dealer = 1;
window.betTimer = null;
window.lastActionWasCheck = false;
window.betTimeLimit = 10
window.lastActiveItem = null;
window.usedJokerThisHand = null;
window.jokerSounds = {
    GLITCH: new Audio("./sounds/glitch_the_river.wav"),
    NEURAL_BLUFF: new Audio("./sounds/nueral_bluff.wav"),
    PREDICTIVE_BET: new Audio("./sounds/predictive_bet.wav"),
    QUANTUM_SWAP: new Audio("./sounds/quantum_swap.wav"),
};

window.resetGame = function () {
    clearTimeout(window.betTimer);
    document.getElementById("showdown-modal").style.display = "none";
    window.player1Chips = 1000;
    window.player2Chips = 1000;
    window.player1Cards = [];
    window.player2Cards = [];
    window.communityCards = [];
    window.bettingRound = 0;
    window.player1TotalBet = 0;
    window.player2TotalBet = 0;
    window.betTimer = null;
    window.usedJokerThisHand = null;
    window.revealedOpponentCardIndex = null;
    window.pot = 0;
    window.currentPlayer = 1;
    window.dealCards();
};

window.playAgain = function () {
    clearTimeout(window.betTimer);
    document.getElementById("showdown-modal").style.display = "none";
    window.player1Cards = [];
    window.player2Cards = [];
    window.communityCards = [];
    window.bettingRound = 0;
    window.player1TotalBet = 0;
    window.player2TotalBet = 0;
    window.pot = 0;
    window.betTimer = null;
    window.usedJokerThisHand = null;
    window.revealedOpponentCardIndex = null;
    window.currentPlayer = 1;
    window.dealer = window.dealer === 1 ? 2 : 1;
    window.dealCards();
};

window.createDeck = function () {
    window.deck = [];
    for (const suit of window.suits) {
        for (const value of window.values) {
            window.deck.push(`${value}${suit}`);
        }
    }
    for (let i = window.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [window.deck[i], window.deck[j]] = [window.deck[j], window.deck[i]];
    }
};

window.updateBlindsUI = function () {
    document.querySelectorAll(".blind-icon").forEach(el => el.remove());
    const bigBlindPlayer = dealer === 1 ? "player2-area-header" : "player1-area-header";
    let bigBlindIcon = document.createElement("img");
    bigBlindIcon.className = "blind-icon big-blind";
    bigBlindIcon.height = 20;
    bigBlindIcon.width = 20;
    bigBlindIcon.style.marginLeft = "5px";
    bigBlindIcon.src = "./assets/dealer-button.png";
    bigBlindIcon.alt = "BB";
    document.getElementById(bigBlindPlayer).appendChild(bigBlindIcon);
}

// ------------------------------------------------------------
// Button Text & UI Helper Functions
// ------------------------------------------------------------
window.updateCallButton = function (value) {
    const callButton = document.getElementById("call-button");
    let selectedAmount = parseInt(value.replace("$", ""));
    let requiredCall =
        currentPlayer === 1
            ? player2TotalBet - player1TotalBet
            : player1TotalBet - player2TotalBet;
    if (requiredCall < 0) requiredCall = 0;
    if (selectedAmount < requiredCall) {
        selectedAmount = requiredCall;
    }
    callButton.setAttribute("data-selected", "$" + selectedAmount);
    callButton.setAttribute("value", "$" + selectedAmount);
    if (requiredCall > 0) {
        if (selectedAmount === requiredCall) {
            callButton.textContent = "Call - $" + selectedAmount;
        } else {
            callButton.textContent = "Raise - $" + selectedAmount;
        }
    } else {
        if (selectedAmount > 0) {
            callButton.textContent = "Bet - $" + selectedAmount;
        } else {
            callButton.textContent = "Bet";
        }
    }
}

window.updateBetButtonsUI = function () {
    let requiredCall =
        currentPlayer === 1
            ? player2TotalBet - player1TotalBet
            : player1TotalBet - player2TotalBet;
    if (requiredCall < 0) requiredCall = 0;

    const checkButton = document.getElementById("check-button");
    const foldButton = document.getElementById("fold-button");
    const callButton = document.getElementById("call-button");

    if (currentPlayer === 1) {
        // Enable buttons for Player 1
        foldButton.removeAttribute("disabled");
        callButton.removeAttribute("disabled");

        if (requiredCall === 0) {
            checkButton.removeAttribute("disabled");
        } else {
            checkButton.setAttribute("disabled", true);
        }

        let currentSelection = callButton.getAttribute("data-selected") || "$10";
        window.updateCallButton(currentSelection);
    } else {
        // Disable all input buttons during computer's turn
        foldButton.setAttribute("disabled", true);
        callButton.setAttribute("disabled", true);
        checkButton.setAttribute("disabled", true);
    }
};

function getJokerTooltip(card) {
    const abilityInfo = {
        "GLITCH": {
            description: "Glitch the River: Replace the river card after it's revealed.",
            when: "Usable after the river card is revealed."
        },
        "NEURAL_BLUFF": {
            description: "Neural Bluff: Trick your opponent into making a wrong move.",
            when: "Usable during your turn before placing a bet."
        },
        "PREDICTIVE_BET": {
            description: "Predictive Bet: Auto-selects optimal bet based on hand strength.",
            when: "Usable during your turn before placing a bet."
        },
        "QUANTUM_SWAP": {
            description: "Quantum Swap: Swap one of your hole cards with a random one.",
            when: "Usable before the flop is revealed."
        }
    };

    const info = abilityInfo[card] || { description: "Joker Ability", when: "" };
    const isUsed = window.usedJokerThisHand === card;
    const hasUsedAny = window.usedJokerThisHand !== null;
    const usable = canUseJoker(card);

    let statusNote = "";

    if (isUsed) {
        statusNote = "✅ This Joker has already been used.";
    } else if (hasUsedAny) {
        statusNote = "❌ Only one Joker can be used per hand.";
    } else if (!usable) {
        statusNote = "⚠️ You can't use this Joker right now.";
    } else {
        statusNote = "🟢 Ready to use!";
    }

    return `
        ${info.description}
        <br><small>${info.when}</small>
        <small style="opacity: 0.8;">${statusNote}</small>
    `;
}

window.canUseJoker = function (card) {
    if (window.usedJokerThisHand) return false;

    switch (card) {
        case "GLITCH":
            return window.communityCards.length === 5;
        case "NEURAL_BLUFF":
        case "PREDICTIVE_BET":
            return window.currentPlayer === 1;
        case "QUANTUM_SWAP":
            return window.communityCards.length === 0;
        default:
            return false;
    }
};

window.playJokerSound = function (cardKey) {
    const sound = window.jokerSounds[cardKey];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Sound error:", e));
    }
};

// ------------------------------------------------------------
// Modified updateDisplay Function to Flip/Hide Opponent's Hand
// ------------------------------------------------------------
window.updateDisplay = function () {
    document
        .getElementById("player1-area")
        .classList.toggle("active", currentPlayer === 1);
    document
        .getElementById("player2-area")
        .classList.toggle("active", currentPlayer === 2);

    // Updated getCardImage to render the special Glitch card using the black_joker.svg asset.
    function getCardImage(card) {
        const specialCards = {
            "GLITCH": "glitch_the_river.png",
            "NEURAL_BLUFF": "neural_bluff.png",
            "PREDICTIVE_BET": "predictive_bet.png",
            "QUANTUM_SWAP": "quantum_swap.png"
        };

        if (specialCards[card]) {
            const isUsed = window.usedJokerThisHand === card;
            const hasUsedAny = window.usedJokerThisHand !== null;
            const usable = canUseJoker(card);

            const isDisabledByOtherJoker = hasUsedAny && !isUsed;
            const isNotUsableYet = !usable && !hasUsedAny;

            const shouldDisableClick = isUsed || isDisabledByOtherJoker || isNotUsableYet;
            const scaleStyle = card === "GLITCH"
                ? 'transform: scale(1.15); margin: 15px;'
                : 'transform: scale(1.2); margin: 15px;';

            const opacity = shouldDisableClick ? '0.35' : '1';
            const cursor = shouldDisableClick ? 'default' : 'pointer';
            const pointerEvents = 'auto'; // always enabled
            const onClickHandler = !shouldDisableClick ? `onclick="window.use${card}()"` : '';

            return `
                <div class="card tooltip-wrapper"
                    style="${scaleStyle}; cursor: ${cursor}; position: relative; pointer-events: ${pointerEvents};"
                    ${onClickHandler}>
                    <img src="./assets/cards/${specialCards[card]}" style="opacity: ${opacity};" class="card-image" alt="${card}">
                    <div class="custom-tooltip">${getJokerTooltip(card)}</div>
                    ${isUsed ? `<div class="joker-label used">USED</div>` : ''}
                    ${isDisabledByOtherJoker ? `<div class="joker-label cross">✖</div>` : ''}
                </div>
            `;
        }

        // Normal playing cards
        let value = card.slice(0, -1);
        let suit = card.slice(-1);
        let valueMap = { K: "king", Q: "queen", J: "jack", A: "ace" };
        let suitMap = { "♠": "spades", "♣": "clubs", "♦": "diamonds", "♥": "hearts" };
        let cardValue = valueMap[value] || value;
        let fileName = `${cardValue}_of_${suitMap[suit]}.svg`.toLowerCase();
        return `<div class="card"><img src="./assets/cards/${fileName}" class="card-image" alt="${card}"></div>`;
    }

    function getCardBack() {
        return `<div class="card"><img src="./assets/cards/card-back.svg" class="card-image" alt="Card Back"></div>`;
    }

    function getDotSeparator() {
        return `<div class="separator-dot">•</div>`;
    }

    let player1CardsHTML, player2CardsHTML;
    // If the showdown modal is open, reveal both hands.
    const showdownModalDisplay = document.getElementById("showdown-modal").style.display;
    if (showdownModalDisplay === "block") {
        player1CardsHTML = player1Cards.map(card => getCardImage(card)).join("");
        player2CardsHTML = player2Cards.map(card => getCardImage(card)).join("");
    } else {
        // Only reveal the current player's hand; hide the opponent's.
        if (currentPlayer === 1) {
            player1CardsHTML = player1Cards.map(card => getCardImage(card)).join("");
            player2CardsHTML = player2Cards.map((card, idx) => {
                if (window.revealedOpponentCardIndex === idx) {
                    return getCardImage(card); // reveal selected
                } else {
                    return getCardBack();
                }
            }).join("")
        } else if (currentPlayer === 2) {
            player1CardsHTML = player1Cards.map(card => getCardImage(card)).join("");
            player2CardsHTML = player2Cards.map((card, idx) => {
                if (window.revealedOpponentCardIndex === idx) {
                    return getCardImage(card); // Show only the revealed card
                } else {
                    return getCardBack(); // Hide the rest
                }
            }).join("");
        } else {
            player1CardsHTML = player1Cards.map(card => getCardImage(card)).join("");
            player2CardsHTML = player2Cards.map(card => getCardImage(card)).join("");
        }
    }

    let communityCardsHTML = "";
    for (let i = 0; i < communityCards.length; i++) {
        communityCardsHTML += getCardImage(communityCards[i]);
        if (i === 2 || i === 3) {
            communityCardsHTML += getDotSeparator();
        }
    }
    let remainingBacks = 5 - communityCards.length;
    for (let i = 0; i < remainingBacks; i++) {
        communityCardsHTML += getCardBack();
        let totalCards = communityCards.length + i;
        if (totalCards === 2 || totalCards === 3) {
            communityCardsHTML += getDotSeparator();
        }
    }

    if (player1CardsHTML !== document.getElementById("player1-cards").innerHTML) {
        document.getElementById("player1-cards").innerHTML = player1CardsHTML;
    }
    if (player2CardsHTML !== document.getElementById("player2-cards").innerHTML) {
        document.getElementById("player2-cards").innerHTML = player2CardsHTML;
    }
    if (communityCardsHTML !== document.getElementById("community-cards").innerHTML) {
        document.getElementById("community-cards").innerHTML = communityCardsHTML;
    }
    // Render Glitch card(s) in Joker area
    let jokerHTML = "";
    for (const card of window.jokerCards) {
        jokerHTML += getCardImage(card);
    }
    document.getElementById("joker-cards").innerHTML = jokerHTML;

    document.getElementById("player1-chips").innerText = `$${player1Chips}`;
    document.getElementById("player2-chips").innerText = `$${player2Chips}`;
    document.getElementById("pot-amount").innerText = pot;

    window.updateBetButtonsUI();
}

window.assignBlinds = function () {
    if (window.dealer === 1) {
        // Player 1 is dealer → P1 = SB, P2 = BB → P1 acts first
        window.player1Chips -= window.smallBlind;
        window.player2Chips -= window.bigBlind;
        window.player1TotalBet = window.smallBlind;
        window.player2TotalBet = window.bigBlind;
        window.currentPlayer = 1;
    } else {
        // Player 2 is dealer → P2 = SB, P1 = BB → P2 acts first
        window.player2Chips -= window.smallBlind;
        window.player1Chips -= window.bigBlind;
        window.player2TotalBet = window.smallBlind;
        window.player1TotalBet = window.bigBlind;
        window.currentPlayer = 2;
    }

    window.pot = window.smallBlind + window.bigBlind;
    window.updateBlindsUI();
    window.updateDisplay();

    // 👇 If computer is first to act, run its turn immediately
    if (window.currentPlayer === 2 && typeof window.runComputerTurn === 'function') {
        setTimeout(() => {
            window.runComputerTurn();
        }, 1000);
    }
};

window.dealCards = function () {
    window.createDeck();
    window.assignBlinds();
    window.player1Cards = [window.deck.pop(), window.deck.pop()];
    window.player2Cards = [window.deck.pop(), window.deck.pop()];
    window.jokerCards = ["GLITCH", "NEURAL_BLUFF", "PREDICTIVE_BET", "QUANTUM_SWAP"];
    window.communityCards = [];
    window.bettingRound = 0;
    window.updateDisplay();
};

window.fold = function () {
    // Reset the timer on fold.
    clearTimeout(betTimer);
    const winner = currentPlayer === 1 ? "Player 2" : "Player 1";
    if (currentPlayer === 1) {
        player2Chips += pot;
    } else {
        player1Chips += pot;
    }
    document.getElementById("winner-message").innerText = `${winner} wins by fold!`;
    document.getElementById("showdown-modal").style.display = "block";
}

// ------------------------------------------------------------
// Betting Functions
// ------------------------------------------------------------
window.placeBet = function () {
    chipsSound.currentTime = 0;
    chipsSound.play().catch(err => console.log("Audio play error:", err));
    clearTimeout(betTimer);

    let betButtonValue = document.getElementById("call-button").getAttribute("value");
    let betAmount = parseInt(betButtonValue.replace("$", ""));
    if (betAmount <= 0) {
        // If no bet amount is selected, the player should use the Check button.
        return;
    }

    // Reset the check flag when a bet is placed.
    lastActionWasCheck = false;

    if (currentPlayer === 1 && betAmount <= player1Chips) {
        player1Chips -= betAmount;
        player1TotalBet += betAmount;
        pot += betAmount;
        currentPlayer = 2;
    } else if (currentPlayer === 2 && betAmount <= player2Chips) {
        player2Chips -= betAmount;
        player2TotalBet += betAmount;
        pot += betAmount;
        currentPlayer = 1;
    } else {
        alert("Not enough chips!");
        return;
    }

    // If both players’ bets are equal, end the betting round.
    if (player1TotalBet === player2TotalBet) {
        revealCommunityCards();
    }

    updateDisplay();
    startBettingTimer();

    if (currentPlayer === 2 && typeof window.runComputerTurn === 'function') {
        // Delay the AI's turn to avoid acting too quickly in the same cycle
        setTimeout(() => {
            window.runComputerTurn();
        }, 1000); // 1 second delay is enough to avoid overlap
    }
}

window.check = function () {
    clearTimeout(betTimer);
    // If the previous action was also a check, two consecutive checks end the betting round.
    if (lastActionWasCheck) {
        lastActionWasCheck = false;
        revealCommunityCards();
    } else {
        lastActionWasCheck = true;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateDisplay();
        startBettingTimer();
    }
}

window.startBettingTimer = function () {
    let timeLeft = betTimeLimit;
    function countdown() {
        if (timeLeft <= 0) {
            clearTimeout(betTimer);
            handleBetTimeout();
        } else {
            timeLeft--;
            betTimer = setTimeout(countdown, 1000);
        }
    }
    countdown();
}

window.handleBetTimeout = function () {
    const winner = currentPlayer === 1 ? "Player 2" : "Player 1";
    document.getElementById("winner-message").innerText = `You lost your chance to win! ${winner} wins the game.`;
    document.getElementById("showdown-modal").style.display = "block";
    endGame();
}

window.endGame = function () {
    clearTimeout(betTimer);
    // Optionally, reload the game after showing the modal.
    // setTimeout(() => { location.reload(); }, 5000);
}

window.revealCommunityCards = function () {
    if (window.bettingRound === 0) window.communityCards.push(window.deck.pop(), window.deck.pop(), window.deck.pop());
    else if (window.bettingRound < 3) window.communityCards.push(window.deck.pop());
    else window.showDown();
    window.bettingRound++;
    window.currentPlayer = 1;
    window.updateDisplay();
};

window.convertCards = function (cards) {
    const suitMap = { "♥": "h", "♦": "d", "♠": "s", "♣": "c" };
    return cards.filter(c => c !== "GLITCH").map(card => {
        let rank = card.slice(0, -1);
        let suit = suitMap[card.slice(-1)];
        if (rank === "10") rank = "T";
        return `${rank}${suit}`;
    });
};

window.showDown = function () {
    clearTimeout(window.betTimer);
    const hand1 = Hand.solve(window.convertCards([...window.player1Cards, ...window.communityCards]));
    const hand2 = Hand.solve(window.convertCards([...window.player2Cards, ...window.communityCards]));
    let winnerMessage = "";
    if (hand1.loseTo(hand2)) { winnerMessage = `Player 2 Wins (${hand2.descr})!`; window.player2Chips += window.pot; }
    else if (hand2.loseTo(hand1)) { winnerMessage = `Player 1 Wins (${hand1.descr})!`; window.player1Chips += window.pot; }
    else { winnerMessage = `It's a tie (${hand1.descr})!`; window.player1Chips += window.pot / 2; window.player2Chips += window.pot / 2; }
    document.getElementById("winner-message").innerText = winnerMessage;
    document.getElementById("showdown-modal").style.display = "block";
    window.pot = 0;
    window.updateDisplay();
};

window.dealCards();
