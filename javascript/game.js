document.addEventListener("DOMContentLoaded", () => {
    class GameUI {
        constructor() {
            this.startMenuScreen = document.getElementById("start-menu-screen");
            this.settingsScreen = document.getElementById("settings-screen");
            this.instructionsScreen = document.getElementById(
                "instructions-screen"
            );
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
                // this.hud.style.display = "block";
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
            // Your start game code here;
        }

        endGame() {
            const endGameSound = document.getElementById("end-game-sound");
            this.swapToScreen(this.gameOverScreen);
            endGameSound.play();
            // Your end game code here;
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

        // Your UI functions here;
    }
    class GameLogic {
        constructor() { }
        // Your game logic here;
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
            const gameContainer = document.getElementById("game-screen");
            // Prepare game container DOM elements here;
            // Connect DOM element to game logic or game ui accordingly;
            this.assignButtons();
        }
        startGame() {
            this.ui.startGame();
            // Start game logic here;

            // this.updateInterval = /* Your desired update interval */;

            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.animationFrameId = requestAnimationFrame(
                this.gameLoop.bind(this)
            );
        }
        updateGame() {
            // Update game logic here;
        }
        resetGame() {
            // Reset game logic here;
            this.isPaused = false;
            cancelAnimationFrame(this.animationFrameId);
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
            this.animationFrameId = requestAnimationFrame(
                this.gameLoop.bind(this)
            );
        }
        assignButtons() {
            const playButton = document.getElementById("play-button");
            const settingsButton = document.getElementById("settings-button");
            const instructionsButton = document.getElementById(
                "instructions-button"
            );
            const playAgainButton =
                document.getElementById("play-again-button");
            const mainMenuButtons = document.querySelectorAll(
                "#game-over-main-menu-button, #settings-back-button, #instructions-back-button"
            );
            const gameMenuButton = document.getElementById("game-menu-button");
            const gameRestartButton = document.getElementById(
                "game-restart-button"
            );
            const gameInstructionsButton = document.getElementById(
                "game-instructions-button"
            );

            playButton.addEventListener("click", this.startGame.bind(this));
            settingsButton.addEventListener(
                "click",
                this.ui.settings.bind(this.ui)
            );
            instructionsButton.addEventListener(
                "click",
                this.ui.instructions.bind(this.ui)
            );
            playAgainButton.addEventListener(
                "click",
                this.startGame.bind(this)
            );
            mainMenuButtons.forEach((button) =>
                button.addEventListener("click", () => {
                    this.ui.mainMenu();
                })
            );
            gameMenuButton.addEventListener("click", () => {
                this.ui.mainMenu();
            });
            gameRestartButton.addEventListener(
                "click",
                this.startGame.bind(this)
            );
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

            // Your button event listeners here
        }
    }
    const game = new Game();
    game.prepareGame();
});







const suits = ["♠", "♣", "♦", "♥"];
const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
];
let deck = [],
    player1Cards = [],
    player2Cards = [],
    communityCards = [];
let player1Chips = 1000,
    player2Chips = 1000,
    pot = 0,
    currentPlayer = 1;
let bettingRound = 0;

function resetGame() {
    document.getElementById("showdown-modal").style.display = "none";
    player1Chips = 1000;
    player2Chips = 1000;
    pot = 0;
    currentPlayer = 1;
    dealCards();
}

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push(`${value}${suit}`);
        }
    }
    deck.sort(() => Math.random() - 0.5);
}

function dealCards() {
    createDeck();
    player1Cards = [deck.pop(), deck.pop()];
    player2Cards = [deck.pop(), deck.pop()];
    communityCards = [];
    bettingRound = 0;
    pot = 0;
    updateDisplay();
}

let betTimer; // Store the countdown timer
const betTimeLimit = 10; // Time limit in seconds

function placeBet() {
    clearTimeout(betTimer); // Clear previous timer
    const callButtonValue = document.getElementById("call-button").getAttribute('value')
    let betAmount = callButtonValue.toUpperCase() === 'ALL-IN' ? (currentPlayer === 1 ? player1Chips : player2Chips) : parseInt(callButtonValue.replace('$', ''));
    if (betAmount <= 0) return;
    if (currentPlayer === 1 && betAmount <= player1Chips) {
        player1Chips -= betAmount;
        pot += betAmount;
        currentPlayer = 2;
    } else if (currentPlayer === 2 && betAmount <= player2Chips) {
        player2Chips -= betAmount;
        pot += betAmount;
        currentPlayer = 1;
    } else {
        alert("Not enough chips!");
        return;
    }
    if (player1Chips === player2Chips) revealCommunityCards();
    updateDisplay();

    // Start a new timer for the next player
    startBettingTimer();
}

// Function to start the 10-second timer
function startBettingTimer() {
    let timeLeft = betTimeLimit;

    function countdown() {
        if (timeLeft <= 0) {
            clearTimeout(betTimer);
            handleBetTimeout();
        } else {
            console.log(`Player ${currentPlayer} has ${timeLeft} seconds left to bet.`);
            timeLeft--;
            betTimer = setTimeout(countdown, 1000);
        }
    }

    countdown();
}

// Function to handle when a player runs out of time
function handleBetTimeout() {
    const winner = currentPlayer === 1 ? "Player 2" : "Player 1";
    document.getElementById("winner-message").innerText = `You lost your chance to win! ${winner} wins the game.`;
    document.getElementById("showdown-modal").style.display = "block"; // Show modal
    endGame();
}

// Function to end the game (reset or redirect)
function endGame() {
    clearTimeout(betTimer);
    // setTimeout(() => {
    //     location.reload(); // Reload game after showing the modal
    // }, 5000);
}

function revealCommunityCards() {
    if (player1Chips === player2Chips) {
        if (bettingRound === 0)
            communityCards.push(deck.pop(), deck.pop(), deck.pop());
        else if (bettingRound === 1) communityCards.push(deck.pop());
        else if (bettingRound === 2) communityCards.push(deck.pop());
        else showDown();
        bettingRound++;
        currentPlayer = 1;
        updateDisplay();
    }
}

function getHandRank(cards) {
    let values = cards.map((card) => card.slice(0, -1));
    let suits = cards.map((card) => card.slice(-1));
    let valueCounts = {};
    let suitCounts = {};

    values.forEach((v) => (valueCounts[v] = (valueCounts[v] || 0) + 1));
    suits.forEach((s) => (suitCounts[s] = (suitCounts[s] || 0) + 1));

    let sortedValues = Object.keys(valueCounts).sort(
        (a, b) => values.indexOf(b) - values.indexOf(a)
    );
    let sortedCounts = Object.entries(valueCounts).sort(
        (a, b) => b[1] - a[1] || values.indexOf(b[0]) - values.indexOf(a[0])
    );

    let isFlush = Object.values(suitCounts).some((count) => count >= 5);
    let isStraight = checkStraight(sortedValues);

    if (isFlush && isStraight)
        return { rank: 8, name: `Straight Flush (${sortedValues[0]} high)` };
    if (sortedCounts[0][1] === 4)
        return { rank: 7, name: `Four of a Kind (${sortedCounts[0][0]})` };
    if (sortedCounts[0][1] === 3 && sortedCounts[1][1] === 2)
        return {
            rank: 6,
            name: `Full House (${sortedCounts[0][0]} over ${sortedCounts[1][0]})`,
        };
    if (isFlush)
        return { rank: 5, name: `Flush (${sortedValues[0]} high)` };
    if (isStraight)
        return { rank: 4, name: `Straight (${sortedValues[0]} high)` };
    if (sortedCounts[0][1] === 3)
        return { rank: 3, name: `Three of a Kind (${sortedCounts[0][0]})` };
    if (sortedCounts[0][1] === 2 && sortedCounts[1][1] === 2)
        return {
            rank: 2,
            name: `Two Pair (${sortedCounts[0][0]} and ${sortedCounts[1][0]})`,
        };
    if (sortedCounts[0][1] === 2)
        return { rank: 1, name: `One Pair (${sortedCounts[0][0]})` };

    return { rank: 0, name: `High Card (${sortedValues[0]})` };
}

function compareSameRankHands(hand1Values, hand2Values) {
    for (let i = 0; i < hand1Values.length; i++) {
        if (hand1Values[i] !== hand2Values[i]) {
            return hand1Values[i] > hand2Values[i] ? 1 : -1;
        }
    }
    return 0;
}

function showDown() {
    let player1Hand = [...player1Cards, ...communityCards];
    let player2Hand = [...player2Cards, ...communityCards];

    let player1BestHand = getHandRank(player1Hand);
    let player2BestHand = getHandRank(player2Hand);

    let winnerMessage;
    if (player1BestHand.rank > player2BestHand.rank) {
        winnerMessage = `Player 1 Wins with ${player1BestHand.name}!`;
        player1Chips += pot;
    } else if (player2BestHand.rank > player1BestHand.rank) {
        winnerMessage = `Player 2 Wins with ${player2BestHand.name}!`;
        player2Chips += pot;
    } else {
        let comparison = compareSameRankHands(
            player1BestHand.name,
            player2BestHand.name
        );
        if (comparison > 0) {
            winnerMessage = `Player 1 Wins with ${player1BestHand.name} (${player1BestHand.name} higher)!`;
            player1Chips += pot;
        } else if (comparison < 0) {
            winnerMessage = `Player 2 Wins with ${player2BestHand.name} (${player2BestHand.name} higher)!`;
            player2Chips += pot;
        } else {
            winnerMessage = `It's a tie with ${player1BestHand.name}!`;
            player1Chips += pot / 2;
            player2Chips += pot / 2;
        }
    }

    document.getElementById("winner-message").innerText = winnerMessage;
    document.getElementById("showdown-modal").style.display = "block";
}

function checkStraight(values) {
    let indexMap = {
        2: 0,
        3: 1,
        4: 2,
        5: 3,
        6: 4,
        7: 5,
        8: 6,
        9: 7,
        10: 8,
        J: 9,
        Q: 10,
        K: 11,
        A: 12,
    };
    let indexValues = values.map((v) => indexMap[v]).sort((a, b) => a - b);
    let count = 1;
    for (let i = 1; i < indexValues.length; i++) {
        if (indexValues[i] === indexValues[i - 1] + 1) count++;
        else if (indexValues[i] !== indexValues[i - 1]) count = 1;
        if (count >= 5) return true;
    }
    return false;
}

function compareSameRankHands(hand1, hand2) {
    for (let i = 0; i < hand1.length; i++) {
        if (hand1[i] !== hand2[i]) {
            return hand1[i] > hand2[i] ? 1 : -1;
        }
    }
    return 0;
}

function updateDisplay() {
    document
        .getElementById("player1-area")
        .classList.toggle("active", currentPlayer === 1);
    document
        .getElementById("player2-area")
        .classList.toggle("active", currentPlayer === 2);

    function getCardImage(card) {
        let value = card.slice(0, -1);
        let suit = card.slice(-1);

        let valueMap = {
            "K": "king",
            "Q": "queen",
            "J": "jack",
            "A": "ace"
        };

        let suitMap = {
            "♠": "spades",
            "♣": "clubs",
            "♦": "diamonds",
            "♥": "hearts"
        };

        let cardValue = valueMap[value] || value; // Convert face cards, keep numbers as they are
        let fileName = `${cardValue}_of_${suitMap[suit]}.svg`.toLowerCase();
        return `<div class="card"><img src="./assets/cards/${fileName}" class="card-image" alt="${card}"></div>`;
    }

    function getCardBack() {
        return `<div class="card"><img src="./assets/cards/card-back.svg" class="card-image" alt="Card Back"></div>`;
    }

    function getDotSeparator() {
        return `<div class="separator-dot">•</div>`; // Styled dot separator
    }

    const player1CardsHTML = player1Cards.map((card) => getCardImage(card)).join("");
    const player2CardsHTML = player2Cards.map((card) => getCardImage(card)).join("");

    // Handle community cards with dot separators
    let communityCardsHTML = "";

    for (let i = 0; i < communityCards.length; i++) {
        communityCardsHTML += getCardImage(communityCards[i]);

        // Add separator dots after 3rd and 4th card
        if (i === 2 || i === 3) {
            communityCardsHTML += getDotSeparator();
        }
    }

    // Fill remaining slots with card-back images and ensure dots are included
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
}

dealCards();
document.getElementById("call-button").addEventListener("click", placeBet);



// bet roller js

jQuery.fn.momentus = function (cfg) {
    /******** Initialize *****************/
    var now =
        Date.now ||
        function () {
            return new Date().valueOf();
        },
        start_point = { x: 0, y: 0 },
        last_point = { x: 0, y: 0 },
        current_coords = { x: 0, y: 0 },
        last_coords = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        last_time = now(),
        inertia_time = last_time,
        /******** End Initialize *************/

        /******** Configuration **************/
        /**
         * @cfg {Number} mass : The unitless mass of this Momentus
         */
        mass = cfg.mass || 1000,
        /**
         * @cfg {Number} u : The friction coefficient
         */
        u = cfg.u || 4,
        /**
         * @cfg {Number} wheelRatio : The amount to divide mousewheel deltas by (to get desired sensitivity)
         */
        wheel_ratio = cfg.wheelRatio || 1000,
        /**
         * @cfg {Number} mouseRatio : The amount to divide mousemove deltas by
         */
        mouse_ratio = cfg.mouseRatio || 20,
        /**
         * @cfg {Number} touchRatio : The amount to divide touchmove deltas by
         */
        touch_ratio = cfg.touchRatio || 1,
        /**
         * @cfg {Function} onChange : Callback called when any change is made to position or velocity
         *    @param {Object} coordinates {x: current_x, y: current_y}
         *    @param {Object} velocity {x: current_vX, y: current_vY}
         */
        on_change = cfg.onChange || function () { },
        /**
         * @cfg {Number} frameRate : If requestAnimationFrame is not supported, the fps at which to update
         */
        frame_rate = cfg.frameRate || 60;
    /******** End Configuration **************/

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

// // $(".wheel").momentus({
// //     u: 1,
// //     mass: 1000,
// //     wheelRatio: -1000,
// //     mouseRatio: 6,
// //     onChange: function (coords, velocity) {
// //         console.log("update");
// //         $(".wheel > div").each(function (i) {
// //             var angle = -(coords.y / 2) + (360 / 16) * i;
// //             $(this).css(
// //                 "transform",
// //                 "perspective(500px) rotate3d(1,0,0," +
// //                 angle +
// //                 "deg) translate3d(0,0,158px)"
// //             );
// //         });
// //     }
// // });

// function createWheel(items) {
//     const wheel = document.querySelector(".wheel");
//     wheel.innerHTML = ""; // Clear existing items

//     const numItems = items.length;
//     const angleStep = 360 / numItems;
//     const radius = 158; // Keep or adjust as needed

//     items.forEach((item, i) => {
//         const div = document.createElement("div");
//         div.textContent = item;

//         const angle = i * angleStep;
//         div.style.transform = `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;
//         div.style.MozTransform = `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;
//         div.style.msTransform = `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;
//         div.style.webkitTransform = `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;

//         wheel.appendChild(div);
//     });
// }

// const items = ["$10", "$20", "$30", "$40", "$50", "$60", "$70", "$80", "$90", "$100", "$110", "$120", "$130", "$140", "$150", "$160", "$170", "$180", "$190", "ALL-IN"];
// createWheel(items)

// // Apply the momentus function
// $(".wheel").momentus({
//     u: 1,
//     mass: 1000,
//     wheelRatio: -1000,
//     mouseRatio: 6,
//     onChange: function (coords, velocity) {
//         console.log("update");
//         const numItems = $(".wheel > div").length;
//         const angleStep = 360 / numItems;

//         $(".wheel > div").each(function (i) {
//             var angle = -(coords.y / 2) + angleStep * i;
//             $(this).css({
//                 "transform": `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,158px)`,
//                 "-moz-transform": `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,158px)`,
//                 "-ms-transform": `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,158px)`,
//                 "-webkit-transform": `perspective(500px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,158px)`
//             });
//         });
//     }
// });

// Load the sound effect
const tickSound = new Audio("sounds/tick.mp3");

// Store the last active item to prevent unnecessary sound playing
let lastActiveItem = null;

function createWheel(items) {
    const wheel = document.querySelector(".wheel");
    wheel.innerHTML = ""; // Clear existing items

    const numItems = items.length;
    const angleStep = 360 / numItems;
    const radius = 80; // Adjusted radius

    items.forEach((item, i) => {
        const div = document.createElement("div");
        div.textContent = item;
        div.dataset.index = i; // Store index for reference

        const angle = i * angleStep;
        div.style.transform = `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;

        wheel.appendChild(div);
    });

    // Set the first item as active by default
    const firstItem = wheel.firstChild;
    if (firstItem) {
        firstItem.classList.add("active");
        lastActiveItem = firstItem;
        updateCallButton(firstItem.textContent);
    }
}

// Function to update the call button text
function updateCallButton(value) {
    document.getElementById("call-button").textContent = value.toUpperCase() === 'ALL-IN' ? `ALL-IN` : `Call - ${value}`;
    document.getElementById("call-button").setAttribute('value', value)
}

const items = ["$10", "$20", "$30", "$40", "$50", "$60", "$70", "$80", "$90", "$100", "$110", "$120", "$130", "$140", "$150", "$160", "$170", "$180", "$190", "ALL-IN"];
createWheel(items);

// Apply the momentus function
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
                "transform": `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,80px)`
            });

            // Determine the closest item to 0 degrees
            let diff = Math.abs(angle % 360);
            if (diff < closestAngle) {
                closestAngle = diff;
                closestItem = this;
            }
        });

        // Remove 'active' class from all items
        $(".wheel > div").removeClass("active");

        // Add 'active' class to the closest item
        if (closestItem) {
            $(closestItem).addClass("active");

            // Play sound only if the active item has changed
            if (closestItem !== lastActiveItem) {
                tickSound.currentTime = 0; // Reset sound for rapid play
                tickSound.play().catch(err => console.log("Audio play error:", err));

                // Update call button text
                updateCallButton(closestItem.textContent);

                lastActiveItem = closestItem;
            }
        }
    }
})

/*
(function(){
  var startY, // px
      curRot = 0, // deg
      vel = 0, // deg/ms
      
      lastRot, // deg
      lastTime, // ms
      lastY, // px
 
      mass = 1000, // virtual
      u = 1, // virtual
  
      iStartTime = Date.now();
  $('.wheel').on('mousedown touchstart', function(e){
    vel = 0;
    e.preventDefault();
    startY = e.pageY/2 || e.originalEvent.touches[0].pageY/2;
    
    $('body').on('mousemove touchmove', function(e){
      e.preventDefault();
      var newY = e.pageY/2 || e.originalEvent.touches[0].pageY/2,
          difRot = (newY - startY); // deg
      curRot -= difRot;
      lastY = startY;
      startY = newY;
      lastRot = difRot;
      lastTime = Date.now();
      //Each side has to be transformed individually due to IE's BS
      $('.wheel > div').each(function(i){
        var angle = curRot + (360/10)*i;
        console.log(i, angle);
        $(this).css('transform', 'perspective(500px) rotate3d(1,0,0,'+angle+'deg) translate3d(0,0,122px)');
      });
    });
    
    $('body').on('mouseup touchend', function(){
      var newTime = Date.now(),
          difTime = newTime - lastTime;
      vel -= (lastRot / difTime)/(e.pageY ? 6 : 1);
      iStartTime = null;
      $('body').off('mousemove touchmove mouseup touchend');
    });
    
  });
  
  (function inertia(){
    if(iStartTime == null){
      //Prevents it from doing a double rotation in a given frame
      iStartTime = Date.now();
    }
    else if(vel != 0){
      var force = vel * u,
          acc = force/mass,
          newTime = Date.now(),
          time = newTime - iStartTime;
      iStartTime = newTime;
      vel -= acc * time;
      var rotDif = (vel * time);
      curRot += rotDif;
      $('.wheel > div').each(function(i){
        var angle = curRot + (360/10)*i;
        $(this).css('transform', 'perspective(500px) rotate3d(1,0,0,'+angle+'deg) translate3d(0,0,122px)');
      });
    }
    requestAnimationFrame(inertia);
  })();
  
  $(document).on('touchmove', function(e){
    e.preventDefault();
  });
  
})();*/
