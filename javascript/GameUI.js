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
        this.hideAllScreens();
        screen.classList.add("active");

        if (screen.id === "game-screen") {
            this.gameControls.style.display = "block";
        } else {
            this.hud.style.display = "none";
            this.gameControls.style.display = "none";
        }
    }

    hideAllScreens() {
        this.startMenuScreen.classList.remove("active");
        this.settingsScreen.classList.remove("active");
        this.instructionsScreen.classList.remove("active");
        this.gameContainer.classList.remove("active");
        this.gameOverScreen.classList.remove("active");
    }

    startGame() {
        const startGameSound = document.getElementById("start-game-sound");
        this.swapToScreen(this.gameContainer);
        startGameSound.play();
    }

    endGame() {
        const endGameSound = document.getElementById("end-game-sound");
        this.swapToScreen(this.gameOverScreen);
        endGameSound.play();
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