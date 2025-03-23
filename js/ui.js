window.GameUI = class {
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
        document.getElementById("start-game-sound")?.play();
        this.swapToScreen(this.gameContainer);
    }

    endGame() {
        document.getElementById("end-game-sound")?.play();
        this.swapToScreen(this.gameOverScreen);
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
};
