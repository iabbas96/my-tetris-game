class MyTetrisController {
    constructor() {
        this.logic = new MyTetrisLogic();
        this.renderer = new MyTetrisRenderer(this.logic);
        
        // Hide UI elements initially
        this.renderer.hideGameOver();
        this.renderer.hidePaused();
        this.renderer.hideCountdown();
        
        this.setupEventListeners();
        this.startCountdown();
    }

    startCountdown() {
        let countdownValue = 3;
        const countdownInterval = setInterval(() => {
            this.renderer.showCountdown(countdownValue);
            
            if (countdownValue > 0) {
                countdownValue--;
            } else {
                this.renderer.showGo();
                setTimeout(() => {
                    this.renderer.hideCountdown();
                    this.logic.countdownActive = false;
                    this.logic.lastDropTime = performance.now();
                    this.gameLoop();
                }, 500);
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    // setting up the game logics and the respective listeners
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.logic.countdownActive) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.logic.moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.logic.moveRight();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.logic.moveDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.logic.rotate();
                    break;
                case ' ':
                    e.preventDefault();
                    this.logic.hardDrop();
                    break;
                case 'c':
                case 'C':
                    e.preventDefault();
                    this.logic.retainPieceAction();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'Escape':
                    e.preventDefault();
                    if (!this.logic.gameOver) {
                        if (confirm('Are you sure you want to end the game now?')) {
                            this.logic.endGame();
                        }
                    }
                    break;
            }
        });

        document.getElementById('play-btn').addEventListener('click', () => {
            this.restartGame();
        });

        // Focus the game area to ensure key events work
        this.renderer.canvas.setAttribute('tabindex', '0');
        this.renderer.canvas.focus();
    }

    togglePause() {
        const wasPaused = this.logic.togglePause();
        if (wasPaused) {
            this.renderer.showPaused();
        } else {
            this.renderer.hidePaused();
            this.logic.lastDropTime = performance.now();
            // Resume game loop if it was paused
            if (!this.logic.gameOver && !this.logic.countdownActive) {
                this.gameLoop();
            }
        }
    }

    restartGame() {
        this.renderer.hideGameOver();
        this.renderer.hidePaused();
        this.logic.init();
        this.startCountdown();
    }

    //below loop is for handling the scores and ensures it works perfectly
    gameLoop() {
        const currentTime = performance.now();
        
        // Update game logic
        this.logic.update(currentTime);
        
        // Get current game state and render
        const gameState = this.logic.getGameState();
        this.renderer.render(gameState);
        
        // Handle game over
        if (gameState.gameOver && !this.logic.countdownActive) {
            this.renderer.showGameOver();
            return; // Stop the game loop
        }
        
        // Continue game loop if not game over and not paused
        if (!gameState.gameOver && !gameState.isPaused && !gameState.countdownActive) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

//Enables the game as the page loads
window.addEventListener('load', () => {
    new MyTetrisController();
});