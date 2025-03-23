window.GameFlow = class {
    constructor(ui = new GameUI(), logic = new GameLogic()) {
        this.ui = ui;
        this.logic = logic;
        this.lastFrameTime = 0;
        this.updateInterval = 1000 / 60;
        this.done = false;
        this.isPaused = false;
        this.animationFrameId = null;
    }

    prepareGame() {
        this.assignButtons();
    }

    startGame() {
        this.ui.startGame();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    updateGame() {
        // Game state updates (if any) can go here
    }

    pause() {
        this.isPaused = true;
        cancelAnimationFrame(this.animationFrameId);
    }

    resume() {
        this.isPaused = false;
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        if (this.done) return;
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.updateInterval) {
            this.updateGame();
            this.lastFrameTime = timestamp;
        }
        if (!this.isPaused) {
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    assignButtons() {
        const btn = id => document.getElementById(id);
        btn("play-button").addEventListener("click", this.startGame.bind(this));
        btn("settings-button").addEventListener("click", () => this.ui.settings());
        btn("instructions-button").addEventListener("click", () => this.ui.instructions());
        btn("play-again-button").addEventListener("click", this.startGame.bind(this));
        document.querySelectorAll("#game-over-main-menu-button, #settings-back-button, #instructions-back-button")
            .forEach(el => el.addEventListener("click", () => this.ui.mainMenu()));
        btn("game-menu-button").addEventListener("click", () => this.ui.mainMenu());
        btn("game-restart-button").addEventListener("click", this.startGame.bind(this));
        btn("game-instructions-button").addEventListener("click", () => {
            this.pause();
            this.ui.swapToScreen(this.ui.instructionsScreen);
            btn("instructions-back-button").addEventListener("click", () => {
                this.ui.swapToScreen(this.ui.gameContainer);
                this.resume();
            }, { once: true });
        });

        btn("check-button").addEventListener("click", window.check);
        const glitchBtn = btn("glitch-button");
        if (glitchBtn) glitchBtn.addEventListener("click", () => {
            const player = window.currentPlayer;
            if ((player === 1 && window.player1Cards.includes("GLITCH")) || (player === 2 && window.player2Cards.includes("GLITCH"))) {
                window.useGlitch(player);
            } else alert("No Glitch card available!");
        });
    }
};