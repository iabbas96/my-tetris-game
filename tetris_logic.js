class MyTetrisLogic {
    // creating the my tetris constructor
    constructor() {
        //setting the borders as a constant values
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.CELL_SIZE = 30;
        this.STARTING_X = 3;
        
        this.boardWidth = this.BOARD_WIDTH;
        this.boardHeight = this.BOARD_HEIGHT;
        this.cellSize = this.CELL_SIZE;

     
        
        //initializing the game state
        this.board = [];
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.countdownActive = true;
        this.countdownValue = 3;
        
        // Pieces
        this.currentPiece = null;
        this.upcomingPiece = null;
        this.retainPiece = null;
        this.canHold = true;
        
        // Timing
        this.lastDropTime = 0;
        this.dropInterval = 1000;
        
        this.initPieces();
        this.init();
    }

    init() {
        // Initialize empty board
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        
        // Reset game state
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.countdownActive = true;
        this.countdownValue = 3;
        this.currentPiece = null;
        this.upcomingPiece = null;
        this.retainPiece = null;
        this.canHold = true;
        this.dropInterval = 1000;

        // Generate first pieces
        this.generateUpcomingPiece();
        this.spawnPiece();
    }

    initPieces() {
        this.pieces = {
            I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: '#00ffff' },
            O: { shape: [[1,1], [1,1]], color: '#ffff00' },
            T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: '#ff00ff' },
            S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: '#00ff00' },
            Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: '#ff0000' },
            J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: '#0000ff' },
            L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: '#ffa500' }
        };
    }

    generateUpcomingPiece() {
        const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const randomType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
        this.upcomingPiece = { 
            type: randomType, 
            shape: JSON.parse(JSON.stringify(this.pieces[randomType].shape)),
            color: this.pieces[randomType].color 
        };
    }

    spawnPiece() {
        if (!this.upcomingPiece) {
            this.generateUpcomingPiece();
        }

        this.currentPiece = {
            type: this.upcomingPiece.type,
            shape: JSON.parse(JSON.stringify(this.upcomingPiece.shape)),
            color: this.upcomingPiece.color,
            x: this.STARTING_X,
            y: 0
        };

        this.generateUpcomingPiece();

        // Check if game over
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver = true;
        }
    }

    // MOVEMENT FUNCTIONS
    moveLeft() {
        if (this.canMove(-1, 0)) {
            this.currentPiece.x--;
            return true;
        }
        return false;
    }

    moveRight() {
        if (this.canMove(1, 0)) {
            this.currentPiece.x++;
            return true;
        }
        return false;
    }

    moveDown() {
        if (this.canMove(0, 1)) {
            this.currentPiece.y++;
            return true;
        }
        return false;
    }

    rotate() {
        if (!this.currentPiece || this.gameOver || this.isPaused || this.countdownActive) return false;

        const shape = this.currentPiece.shape;
        const N = shape.length;
        const newShape = Array(N).fill().map(() => Array(N).fill(0));
        
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                newShape[j][N - 1 - i] = shape[i][j];
            }
        }

        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, newShape)) {
            this.currentPiece.shape = newShape;
            return true;
        }

        return false;
    }

    hardDrop() {
        if (this.countdownActive) return 0;
        let dropDistance = 0;
        while (this.moveDown()) {
            dropDistance++;
        }
        this.lockPiece();
        return dropDistance;
    }

    canMove(dx, dy) {
        if (!this.currentPiece || this.gameOver || this.isPaused || this.countdownActive) return false;
        
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        return !this.checkCollision(newX, newY, this.currentPiece.shape);
    }

    checkCollision(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;

                    if (boardX < 0 || boardX >= this.boardWidth || boardY >= this.boardHeight) {
                        return true;
                    }

                    if (boardY >= 0 && this.board[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lockPiece() {
        if (!this.currentPiece) return;

        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const boardY = this.currentPiece.y + row;
                    const boardX = this.currentPiece.x + col;
                    
                    if (boardY >= 0 && boardY < this.boardHeight && boardX >= 0 && boardX < this.boardWidth) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }

        this.clearLines();
        this.spawnPiece();
        this.canHold = true;
    }



    retainPieceAction() {
        if (!this.canHold || !this.currentPiece || this.gameOver || this.isPaused || this.countdownActive) return false;

        if (!this.retainPiece) {
            this.retainPiece = this.currentPiece.type;
            this.spawnPiece();
        } else {
            const temp = this.currentPiece.type;
            this.currentPiece.type = this.retainPiece;
            this.retainPiece = temp;
            
            this.currentPiece.shape = JSON.parse(JSON.stringify(this.pieces[this.currentPiece.type].shape));
            this.currentPiece.color = this.pieces[this.currentPiece.type].color;
            
            this.currentPiece.x = 3;
            this.currentPiece.y = 0;
            
            if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
                this.retainPiece = this.currentPiece.type;
                this.currentPiece.type = temp;
                this.currentPiece.shape = JSON.parse(JSON.stringify(this.pieces[temp].shape));
                this.currentPiece.color = this.pieces[temp].color;
                return false;
            }
        }

        this.canHold = false;
        return true;
    }

    togglePause() {
        if (this.gameOver || this.countdownActive) return;
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    endGame() {
        if (this.gameOver || this.countdownActive) return;
        this.gameOver = true;
    }

    update(currentTime) {
        if (this.gameOver || this.isPaused || this.countdownActive || !this.currentPiece) return;

        if (currentTime - this.lastDropTime > this.dropInterval) {
            if (!this.moveDown()) {
                this.lockPiece();
            }
            this.lastDropTime = currentTime;
        }
    }

    getGameState() {
        return {
            board: this.board,
            currentPiece: this.currentPiece,
            upcomingPiece: this.upcomingPiece,
            retainPiece: this.retainPiece,
            score: this.score,
            level: this.level,
            linesCleared: this.linesCleared,
            gameOver: this.gameOver,
            isPaused: this.isPaused,
            countdownActive: this.countdownActive,
            countdownValue: this.countdownValue
        };
    }

    // making the score counts
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }

        if (linesCleared > 0) {
            this.linesCleared += linesCleared;
            
            // Calculate score based on lines cleared
            const baseScores = {1: 100, 2: 300, 3: 500, 4: 800};
            const baseScore = baseScores[linesCleared] || 0;
            this.score += baseScore * this.level;
            
            // Update level
            this.level = Math.floor(this.linesCleared / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            
            console.log(`Cleared ${linesCleared} lines! Score: ${this.score}, Level: ${this.level}`);
        }
    }
    


    // Add this method to get pieces for rendering
    getPieces() {
        return this.pieces;
    }
}