document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Game UI, Logic, and Main Game Class
    // ============================================================
    class GameUI {
        constructor() {
            this.startMenuScreen = document.getElementById("start-menu-screen");
            this.settingsScreen = document.getElementById("settings-screen");
            this.instructionsScreen = document.getElementById("instructions-screen");
            this.gameContainer = document.getElementById("game-screen");
            this.gameOverScreen = document.getElementById("game-over-screen");
            this.gameControls = document.getElementById("game-controls");
            this.hud = document.getElementById("hud");
        }

        swapToScreen(screen) {
            this.startMenuScreen.classList.remove("active");
            this.settingsScreen.classList.remove("active");
            this.instructionsScreen.classList.remove("active");
            this.gameContainer.classList.remove("active");
            this.gameOverScreen.classList.remove("active");
            screen.classList.add("active");

            if (screen.id === "game-screen") {
                this.gameControls.style.display = "block";
            } else {
                this.hud.style.display = "none";
                this.gameControls.style.display = "none";
            }
        }

        startGame() {
            const startGameSound = document.getElementById("start-game-sound");
            this.swapToScreen(this.gameContainer);
            startGameSound.play();
            // Additional start game logic can be added here.
        }

        endGame() {
            const endGameSound = document.getElementById("end-game-sound");
            this.swapToScreen(this.gameOverScreen);
            endGameSound.play();
            // Additional end game logic can be added here.
        }

        mainMenu() {
            this.swapToScreen(this.startMenuScreen);
        }

        playAgain() {
            this.swapToScreen(this.gameContainer);
        }

        settings() {
            this.swapToScreen(this.settingsScreen);
        }

        instructions() {
            this.swapToScreen(this.instructionsScreen);
        }
    }

    class GameLogic {
        constructor() {
            // Your game logic here.
        }
    }

    class Game {
        constructor() {
            this.ui = new GameUI();
            this.logic = new GameLogic();
            this.lastFrameTime = 0;
            this.updateInterval = 1000 / 60;
            this.done = false;
            this.isPaused = false;
            this.animationFrameId = null;
        }

        prepareGame() {
            // Prepare game container DOM elements here.
            // Connect DOM element to game logic or game UI accordingly.
            this.assignButtons();
        }

        startGame() {
            this.ui.startGame();
            // Start game logic here.

            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        }

        updateGame() {
            // Update game logic here.
        }

        resetGame() {
            // Clear any active timer before resetting the game.
            clearTimeout(betTimer);
            document.getElementById("showdown-modal").style.display = "none";
            player1Chips = 1000;
            player2Chips = 1000;
            player1Cards = [];
            player2Cards = [];
            communityCards = [];
            bettingRound = 0;
            player1TotalBet = 0;
            player2TotalBet = 0;
            betTimer = null;
            pot = 0;
            currentPlayer = 1;
            deck = [];
            dealCards();
        }

        pause() {
            this.isPaused = true;
            cancelAnimationFrame(this.animationFrameId);
        }

        resume() {
            this.isPaused = false;
            this.gameLoop();
        }

        gameLoop(timestamp) {
            if (this.done) return;
            const deltaTime = timestamp - this.lastFrameTime;
            if (deltaTime > this.updateInterval) {
                this.updateGame();
                this.lastFrameTime = timestamp;
            }
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        }

        assignButtons() {
            const playButton = document.getElementById("play-button");
            const settingsButton = document.getElementById("settings-button");
            const instructionsButton = document.getElementById("instructions-button");
            const playAgainButton = document.getElementById("play-again-button");
            const mainMenuButtons = document.querySelectorAll(
                "#game-over-main-menu-button, #settings-back-button, #instructions-back-button"
            );
            const gameMenuButton = document.getElementById("game-menu-button");
            const gameRestartButton = document.getElementById("game-restart-button");
            const gameInstructionsButton = document.getElementById("game-instructions-button");
            const checkButton = document.getElementById("check-button");
            const glitchButton = document.getElementById("glitch-button"); // New glitch button

            playButton.addEventListener("click", this.startGame.bind(this));
            settingsButton.addEventListener("click", this.ui.settings.bind(this.ui));
            instructionsButton.addEventListener("click", this.ui.instructions.bind(this.ui));
            playAgainButton.addEventListener("click", this.startGame.bind(this));
            mainMenuButtons.forEach((button) =>
                button.addEventListener("click", () => {
                    this.ui.mainMenu();
                })
            );
            gameMenuButton.addEventListener("click", () => {
                this.ui.mainMenu();
            });
            gameRestartButton.addEventListener("click", this.startGame.bind(this));
            gameInstructionsButton.addEventListener("click", () => {
                this.pause();
                this.ui.swapToScreen(this.ui.instructionsScreen);
                document
                    .getElementById("instructions-back-button")
                    .addEventListener(
                        "click",
                        () => {
                            this.ui.swapToScreen(this.ui.gameContainer);
                            this.resume();
                        },
                        { once: true }
                    );
            });

            // Add the new Check button event listener.
            checkButton.addEventListener("click", check);

            // Add the new Glitch button event listener.
            if (glitchButton) {
                glitchButton.addEventListener("click", () => {
                    if (currentPlayer === 1 && player1Cards.includes("GLITCH")) {
                        useGlitch(1);
                    } else if (currentPlayer === 2 && player2Cards.includes("GLITCH")) {
                        useGlitch(2);
                    } else {
                        alert("No Glitch card available!");
                    }
                });
            }
        }
    }

    const game = new Game();
    game.prepareGame();

    // ============================================================
    // Poker Game Logic & Betting Code
    // ============================================================
    const suits = ["♠", "♣", "♦", "♥"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    let deck = [];
    // When dealing cards, each player gets two normal cards plus the special glitch card.
    let player1Cards = [];
    let player2Cards = [];
    let communityCards = [];

    let player1Chips = 1000,
        player2Chips = 1000,
        pot = 0,
        currentPlayer = 1;

    let bettingRound = 0;
    let lastWinner = null;
    let player1TotalBet = 0;
    let player2TotalBet = 0;
    let smallBlind = 10;
    let bigBlind = 20;
    let dealer = 1; // Keeps track of the dealer (1 or 2)
    let betTimer = null; // Store the countdown timer

    // Global flag to track consecutive checks.
    let lastActionWasCheck = false;

    function resetGame() {
        // Reset timer on game reset.
        clearTimeout(betTimer);
        document.getElementById("showdown-modal").style.display = "none";
        player1Chips = 1000;
        player2Chips = 1000;
        player1Cards = [];
        player2Cards = [];
        communityCards = [];
        bettingRound = 0;
        player1TotalBet = 0;
        player2TotalBet = 0;
        betTimer = null;
        pot = 0;
        currentPlayer = 1;
        deck = [];
        dealCards();
    }

    function playAgain() {
        // Reset timer on new hand.
        clearTimeout(betTimer);
        document.getElementById("showdown-modal").style.display = "none";
        player1Cards = [];
        player2Cards = [];
        communityCards = [];
        bettingRound = 0;
        player1TotalBet = 0;
        player2TotalBet = 0;
        pot = 0;
        betTimer = null;
        currentPlayer = 1;
        lastActionWasCheck = false;
        // Swap dealer each round.
        dealer = dealer === 1 ? 2 : 1;
        dealCards();
    }

    function assignBlinds() {
        if (dealer === 1) {
            player1Chips -= smallBlind;
            player2Chips -= bigBlind;
            player1TotalBet = smallBlind;
            player2TotalBet = bigBlind;
            currentPlayer = 1; // Small blind acts first
        } else {
            player2Chips -= smallBlind;
            player1Chips -= bigBlind;
            player2TotalBet = smallBlind;
            player1TotalBet = bigBlind;
            currentPlayer = 2; // Small blind acts first
        }
        pot = smallBlind + bigBlind;
        updateBlindsUI();
        updateDisplay();
    }

    function fold() {
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

    document.getElementById("fold-button").addEventListener("click", fold);

    function updateBlindsUI() {
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

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push(`${value}${suit}`);
            }
        }
        // Fisher-Yates shuffle algorithm
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCards() {
        createDeck();
        assignBlinds();
        // Deal two normal cards and add the special Glitch card ("GLITCH") to each player’s hand.
        player1Cards = [deck.pop(), deck.pop(), "GLITCH"];
        player2Cards = [deck.pop(), deck.pop(), "GLITCH"];
        communityCards = [];
        bettingRound = 0;
        updateDisplay();
    }

    const betTimeLimit = 10; // seconds
    const chipsSound = new Audio("sounds/chips.mp3");

    // ------------------------------------------------------------
    // Betting Functions
    // ------------------------------------------------------------
    function placeBet() {
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
    }

    function check() {
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

    function startBettingTimer() {
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

    function handleBetTimeout() {
        const winner = currentPlayer === 1 ? "Player 2" : "Player 1";
        document.getElementById("winner-message").innerText = `You lost your chance to win! ${winner} wins the game.`;
        document.getElementById("showdown-modal").style.display = "block";
        endGame();
    }

    function endGame() {
        clearTimeout(betTimer);
        // Optionally, reload the game after showing the modal.
        // setTimeout(() => { location.reload(); }, 5000);
    }

    function revealCommunityCards() {
        if (bettingRound === 0) {
            communityCards.push(deck.pop(), deck.pop(), deck.pop());
        } else if (bettingRound === 1) {
            communityCards.push(deck.pop());
        } else if (bettingRound === 2) {
            communityCards.push(deck.pop());
        } else {
            showDown();
        }
        bettingRound++;
        currentPlayer = 1;
        updateDisplay();
    }

    function convertCards(cards) {
        const suitMap = { "♥": "h", "♦": "d", "♠": "s", "♣": "c" };
        const converted = cards.map(card => {
            // Skip special glitch cards
            if (card === "GLITCH") return "";
            let rank = card.slice(0, -1);
            let suit = suitMap[card.slice(-1)];
            if (rank === "10") rank = "T";
            return `${rank}${suit}`;
        }).filter(c => c !== "");
        return converted;
    }

    function showDown() {
        clearTimeout(betTimer);
        // Exclude the glitch card from the hand evaluation.
        let player1Hand = convertCards([...player1Cards.filter(card => card !== "GLITCH"), ...communityCards]);
        let player2Hand = convertCards([...player2Cards.filter(card => card !== "GLITCH"), ...communityCards]);
        const hand1 = Hand.solve(player1Hand);
        const hand2 = Hand.solve(player2Hand);
        let winnerMessage = "";

        if (hand1.loseTo(hand2)) {
            winnerMessage = `Player 2 Wins (${hand2.descr})!`;
            player2Chips += pot;
            lastWinner = 2;
        }
        if (hand2.loseTo(hand1)) {
            winnerMessage = `Player 1 Wins (${hand1.descr})!`;
            player1Chips += pot;
            lastWinner = 1;
        }
        if (hand1.loseTo(hand2) === hand2.loseTo(hand1)) {
            winnerMessage = `It's a tie (${hand1.descr})!`;
            player1Chips += pot / 2;
            player2Chips += pot / 2;
            lastWinner = "tie";
        }

        document.getElementById("winner-message").innerText = winnerMessage;
        document.getElementById("showdown-modal").style.display = "block";
        pot = 0;
        updateDisplay();
    }

    // ------------------------------------------------------------
    // Glitch the River Functionality
    // ------------------------------------------------------------
    // This function allows the current player (if holding the GLITCH card)
    // to replace the river card (last card in communityCards) with the next card from the deck.
    function useGlitch(player) {
        // Ensure the river card has been dealt (communityCards should have 5 cards: flop (3), turn (1), river (1)).
        if (communityCards.length < 5) {
            alert("The river card is not yet dealt!");
            return;
        }
        // Replace the river card (last card) with the next card in the deck.
        const newRiverCard = deck.pop();
        communityCards[communityCards.length - 1] = newRiverCard;
        // Remove the glitch card from the respective player's hand.
        if (player === 1) {
            const index = player1Cards.indexOf("GLITCH");
            if (index > -1) player1Cards.splice(index, 1);
        } else if (player === 2) {
            const index = player2Cards.indexOf("GLITCH");
            if (index > -1) player2Cards.splice(index, 1);
        }
        updateDisplay();
    }

    // ------------------------------------------------------------
    // Button Text & UI Helper Functions
    // ------------------------------------------------------------
    function updateCallButton(value) {
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

    function updateBetButtonsUI() {
        let requiredCall =
            currentPlayer === 1
                ? player2TotalBet - player1TotalBet
                : player1TotalBet - player2TotalBet;
        if (requiredCall < 0) requiredCall = 0;
        const checkButton = document.getElementById("check-button");
        if (requiredCall === 0) {
            checkButton.removeAttribute('disabled')
        } else {
            checkButton.setAttribute('disabled', true)
        }
        let currentSelection = document.getElementById("call-button").getAttribute("data-selected") || "$10";
        updateCallButton(currentSelection);
    }

    // ------------------------------------------------------------
    // Modified updateDisplay Function to Flip/Hide Opponent's Hand
    // ------------------------------------------------------------
    function updateDisplay() {
        document
            .getElementById("player1-area")
            .classList.toggle("active", currentPlayer === 1);
        document
            .getElementById("player2-area")
            .classList.toggle("active", currentPlayer === 2);

        // Updated getCardImage to render the special Glitch card using the black_joker.svg asset.
        function getCardImage(card) {
            if (card === "GLITCH") {
                return `<div class="card"><img src="./assets/cards/glitch_the_river.png" class="card-image" alt="Glitch Card"></div>`;
            }
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
                player2CardsHTML = player2Cards.map(card => getCardBack()).join("");
            } else if (currentPlayer === 2) {
                player1CardsHTML = player1Cards.map(card => getCardBack()).join("");
                player2CardsHTML = player2Cards.map(card => getCardImage(card)).join("");
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

        document.getElementById("player1-chips").innerText = `$${player1Chips}`;
        document.getElementById("player2-chips").innerText = `$${player2Chips}`;
        document.getElementById("pot-amount").innerText = pot;

        updateBetButtonsUI();
    }

    dealCards();
    document.getElementById("call-button").addEventListener("click", placeBet);

    // ============================================================
    // Bet Roller Code (jQuery Plugin)
    // ============================================================
    jQuery.fn.momentus = function (cfg) {
        var now = Date.now || function () {
            return new Date().valueOf();
        },
            start_point = { x: 0, y: 0 },
            last_point = { x: 0, y: 0 },
            current_coords = { x: 0, y: 0 },
            last_coords = { x: 0, y: 0 },
            velocity = { x: 0, y: 0 },
            last_time = now(),
            inertia_time = last_time,
            mass = cfg.mass || 1000,
            u = cfg.u || 4,
            wheel_ratio = cfg.wheelRatio || 1000,
            mouse_ratio = cfg.mouseRatio || 20,
            touch_ratio = cfg.touchRatio || 1,
            on_change = cfg.onChange || function () { },
            frame_rate = cfg.frameRate || 60;

        function calculateVelocity(e) {
            var time = now(),
                delta_time = time - last_time,
                vel_x =
                    velocity.x +
                    last_coords.x / delta_time / (e.pageX ? mouse_ratio : touch_ratio),
                vel_y =
                    velocity.y +
                    last_coords.y / delta_time / (e.pageY ? mouse_ratio : touch_ratio);
            vel_x = !isNaN(vel_x) ? vel_x : 0;
            vel_y = !isNaN(vel_y) ? vel_y : 0;
            return { x: vel_x, y: vel_y };
        }

        $(this).on("mousedown touchstart", function (e) {
            e.preventDefault();
            var x = e.pageX || e.originalEvent.touches[0].pageX,
                y = e.pageY || e.originalEvent.touches[0].pageY;
            last_coords = { x: 0, y: 0 };
            start_point = { x: x, y: y };
            velocity = { x: 0, y: 0 };
            on_change(current_coords, velocity);

            $("body").on("mousemove touchmove", function (e) {
                e.preventDefault();
                var vel = calculateVelocity(e);
                last_time = now();
                var x = e.pageX || e.originalEvent.touches[0].pageX,
                    y = e.pageY || e.originalEvent.touches[0].pageY,
                    delta_x = x - start_point.x,
                    delta_y = y - start_point.y;
                last_point = start_point;
                start_point = { x: x, y: y };
                last_coords.x = delta_x;
                last_coords.y = delta_y;
                current_coords.x += delta_x;
                current_coords.y += delta_y;
                on_change(current_coords, vel);
            });

            $("body").on("mouseup touchend", function (e) {
                velocity = calculateVelocity(e);
                on_change(current_coords, velocity);
                inertia_time = null;
                $("body").off("mousemove touchmove mouseup touchend");
            });
        });

        $(this).on("wheel mousewheel", function (e) {
            if (velocity.x == 0 && velocity.y == 0) inertia_time = now();
            var delta_x = e.originalEvent.deltaX || 0,
                delta_y = e.originalEvent.deltaY || 0;
            velocity.x -= delta_x / wheel_ratio;
            velocity.y -= delta_y / wheel_ratio;
        });

        (function inertia() {
            velocity.x = !isNaN(velocity.x) ? velocity.x : 0;
            velocity.y = !isNaN(velocity.y) ? velocity.y : 0;

            if (!inertia_time) {
                inertia_time = now();
            } else if (velocity.x != 0 || velocity.y != 0) {
                var time = now(),
                    force_x = velocity.x * u,
                    force_y = velocity.y * u,
                    acc_x = force_x / mass,
                    acc_y = force_y / mass,
                    delta_time = time - inertia_time,
                    vel_x = velocity.x - acc_x * delta_time,
                    vel_y = velocity.y - acc_y * delta_time;
                vel_x = !isNaN(vel_x) ? vel_x : 0;
                vel_y = !isNaN(vel_y) ? vel_y : 0;
                velocity.x = vel_x;
                velocity.y = vel_y;
                var delta_x = vel_x * delta_time,
                    delta_y = vel_y * delta_time;
                last_coords.x = current_coords.x;
                last_coords.y = current_coords.y;
                current_coords.x += delta_x;
                current_coords.y += delta_y;
                inertia_time = time;
                on_change(current_coords, velocity);
            }

            if (window.requestAnimationFrame) {
                requestAnimationFrame(inertia);
            }
        })();
        return this;
    };

    const tickSound = new Audio("sounds/tick.mp3");
    let lastActiveItem = null;

    function createWheel(items) {
        const wheel = document.querySelector(".wheel");
        wheel.innerHTML = "";
        const numItems = items.length;
        const angleStep = 360 / numItems;
        const radius = 80;

        items.forEach((item, i) => {
            const div = document.createElement("div");
            div.textContent = item;
            div.dataset.index = i;
            const angle = i * angleStep;
            div.style.transform = `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;
            wheel.appendChild(div);
        });

        const firstItem = wheel.firstChild;
        if (firstItem) {
            firstItem.classList.add("active");
            lastActiveItem = firstItem;
            updateCallButton(firstItem.textContent);
        }
    }

    // (Note: The updateCallButton function above is used by both betting & the wheel.)
    const items = [
        "$10", "$20", "$30", "$40", "$50", "$60", "$70", "$80", "$90",
        "$100", "$110", "$120", "$130", "$140", "$150", "$160", "$170",
        "$180", "$190", "$200"
    ];
    createWheel(items);

    $(".wheel").momentus({
        u: 50,
        mass: 1500,
        wheelRatio: -1500,
        mouseRatio: 4,
        onChange: function (coords, velocity) {
            const numItems = $(".wheel > div").length;
            const angleStep = 360 / numItems;
            let closestItem = null;
            let closestAngle = 9999;

            $(".wheel > div").each(function (i) {
                var angle = -(coords.y / 2) + angleStep * i;
                $(this).css({
                    transform: `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,80px)`
                });
                let diff = Math.abs(angle % 360);
                if (diff < closestAngle) {
                    closestAngle = diff;
                    closestItem = this;
                }
            });

            $(".wheel > div").removeClass("active");

            if (closestItem) {
                $(closestItem).addClass("active");
                if (closestItem !== lastActiveItem) {
                    tickSound.currentTime = 0;
                    tickSound.play().catch(err => console.log("Audio play error:", err));
                    updateCallButton(closestItem.textContent);
                    lastActiveItem = closestItem;
                }
            }
        }
    });
    window.playAgain = playAgain;
    window.resetGame = resetGame;
    // NEW CODE: Use Joker Button Event Listener
    const useJokerButton = document.getElementById("use-joker-button");
    if (useJokerButton) {
        useJokerButton.addEventListener("click", () => {
            if (currentPlayer === 1 && player1Cards.includes("GLITCH")) {
                useGlitch(1);
            } else if (currentPlayer === 2 && player2Cards.includes("GLITCH")) {
                useGlitch(2);
            } else {
                alert("No Joker card available!");
            }
        });
    }
});