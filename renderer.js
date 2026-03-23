class MyTetrisRenderer {
    constructor(logic) {
        this.canvas = document.getElementById('my-tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.retainCanvas = document.getElementById('retain-canvas');
        this.retainCtx = this.retainCanvas.getContext('2d');
        this.upcomingCanvas = document.getElementById('upcoming-canvas');
        this.upcomingCtx = this.upcomingCanvas.getContext('2d');
        
        this.cellSize = 30;
        this.boardWidth = 10;
        this.boardHeight = 20;
        
        this.logic = logic;
        this.setupCanvas();
        
        // Cache DOM elements for better performance
        this.playButton = document.getElementById('play-btn');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.gameOverElement = document.getElementById('game-over');
        this.pausedElement = document.getElementById('paused');
        this.countdownElement = document.getElementById('countdown');
        
        console.log('Renderer initialized - Score element:', this.scoreElement);
    }

    setupCanvas() {
        this.canvas.width = this.boardWidth * this.cellSize;
        this.canvas.height = this.boardHeight * this.cellSize;
    }

    render(gameState) {
        this.renderMainBoard(gameState);
        this.renderRetainPiece(gameState.retainPiece);
        this.renderUpcomingPiece(gameState.upcomingPiece);
        this.updateDisplay(gameState);
    }

    renderMainBoard(gameState) {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw placed pieces
        for (let y = 0; y < gameState.board.length; y++) {
            for (let x = 0; x < gameState.board[y].length; x++) {
                if (gameState.board[y][x]) {
                    this.drawBlock(this.ctx, x, y, gameState.board[y][x]);
                }
            }
        }
        
        // Draw current piece
        if (gameState.currentPiece) {
            for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
                for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
                    if (gameState.currentPiece.shape[y][x]) {
                        const drawX = gameState.currentPiece.x + x;
                        const drawY = gameState.currentPiece.y + y;
                        if (drawY >= 0) {
                            this.drawBlock(this.ctx, drawX, drawY, gameState.currentPiece.color);
                        }
                    }
                }
            }
        }
        
        // Draw grid
        this.drawGrid();
    }

    drawBlock(ctx, x, y, color) {
        const pixelX = x * this.cellSize;
        const pixelY = y * this.cellSize;
        
        ctx.fillStyle = color;
        ctx.fillRect(pixelX, pixelY, this.cellSize, this.cellSize);
        
        // Add 3D effect
        ctx.fillStyle = this.lightenColor(color, 30);
        ctx.fillRect(pixelX, pixelY, this.cellSize, 2);
        ctx.fillRect(pixelX, pixelY, 2, this.cellSize);
        
        ctx.fillStyle = this.darkenColor(color, 30);
        ctx.fillRect(pixelX + this.cellSize - 2, pixelY, 2, this.cellSize);
        ctx.fillRect(pixelX, pixelY + this.cellSize - 2, this.cellSize, 2);
        
        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(pixelX, pixelY, this.cellSize, this.cellSize);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    renderRetainPiece(retainPiece) {
        this.retainCtx.fillStyle = '#000';
        this.retainCtx.fillRect(0, 0, this.retainCanvas.width, this.retainCanvas.height);
        
        if (retainPiece) {
            const pieces = this.logic.getPieces();
            const piece = pieces[retainPiece];
            const blockSize = 20;
            const offsetX = (this.retainCanvas.width - piece.shape[0].length * blockSize) / 2;
            const offsetY = (this.retainCanvas.height - piece.shape.length * blockSize) / 2;
            
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        this.retainCtx.fillStyle = piece.color;
                        this.retainCtx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                        
                        this.retainCtx.strokeStyle = '#000';
                        this.retainCtx.lineWidth = 1;
                        this.retainCtx.strokeRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                    }
                }
            }
        }
    }

    renderUpcomingPiece(upcomingPiece) {
        this.upcomingCtx.fillStyle = '#000';
        this.upcomingCtx.fillRect(0, 0, this.upcomingCanvas.width, this.upcomingCanvas.height);
        
        if (upcomingPiece) {
            const blockSize = 20;
            const offsetX = (this.upcomingCanvas.width - upcomingPiece.shape[0].length * blockSize) / 2;
            const offsetY = (this.upcomingCanvas.height - upcomingPiece.shape.length * blockSize) / 2;
            
            for (let y = 0; y < upcomingPiece.shape.length; y++) {
                for (let x = 0; x < upcomingPiece.shape[y].length; x++) {
                    if (upcomingPiece.shape[y][x]) {
                        this.upcomingCtx.fillStyle = upcomingPiece.color;
                        this.upcomingCtx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                        
                        this.upcomingCtx.strokeStyle = '#000';
                        this.upcomingCtx.lineWidth = 1;
                        this.upcomingCtx.strokeRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize);
                    }
                }
            }
        }
    }

    updateDisplay(gameState) {
        // Debug logging to check if this method is being called
        console.log('Updating display - Score:', gameState.score, 'Level:', gameState.level, 'Lines:', gameState.linesCleared);
        
        if (this.scoreElement) {
            this.scoreElement.textContent = gameState.score;
        } else {
            console.error('Score element not found!');
            // Try to find it again
            this.scoreElement = document.getElementById('score');
        }
        
        if (this.levelElement) {
            this.levelElement.textContent = gameState.level;
        } else {
            console.error('Level element not found!');
            this.levelElement = document.getElementById('level');
        }
        
        if (this.linesElement) {
            this.linesElement.textContent = gameState.linesCleared;
        } else {
            console.error('Lines element not found!');
            this.linesElement = document.getElementById('lines');
        }
    }

    showGameOver() {
        if (this.gameOverElement) {
            this.gameOverElement.style.display = 'block';
        }
    }

    hideGameOver() {
        if (this.gameOverElement) {
            this.gameOverElement.style.display = 'none';
        }
    }

    showPaused() {
        if (this.pausedElement) {
            this.pausedElement.style.display = 'block';
        }
    }

    hidePaused() {
        if (this.pausedElement) {
            this.pausedElement.style.display = 'none';
        }
    }

    showCountdown(value) {
        if (this.countdownElement) {
            this.countdownElement.style.display = 'block';
            this.countdownElement.textContent = value;
            this.countdownElement.style.fontSize = '5em';
            this.countdownElement.style.color = '#00ffff';
            this.countdownElement.style.textShadow = '0 0 20px #00ffff';
        }
    }

    showGo() {
        if (this.countdownElement) {
            this.countdownElement.textContent = 'GO!';
            this.countdownElement.style.color = '#00ff00';
            this.countdownElement.style.textShadow = '0 0 20px #00ff00';
        }
    }

    hideCountdown() {
        if (this.countdownElement) {
            this.countdownElement.style.display = 'none';
        }
    }
}