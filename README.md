# Welcome to My Tetris

---

## Task

The task is to create a Tetris implementation,by demonstrating javascript skills and ensuring that the tetris specifications are followed accordingly and replicating the classic
gameplay while implementing modern software game architecture principles. The challenges are as follows: Ensuring that the 7-bag Random Generator (also called "random bag" or "7 system") is used,
Speed curve must be the same as Tetris Worlds, The Game must use a scoring system, The Game must count down from 3 after you press start and then start playing the game.

## Description

I was able to solve the problem by following the instructions and also event driven with separates components inform of the MVC design, as follows:

1. The Model (MyTetrisLogic): It Handles all game rules, piece movement, collision detection, and scoring
2. The View (MyTetrisRenderer): Manages all visual aspects across multiple canvases
3. The Controller (MyTetrisController): Coordinates user input and game flow
   And also Managing multiple HTML5 canvases simultaneously in the program, ensuring performance with 60fps game loop, accurate piece rotation and wall kick detection,
   ensure proper line clearing and scoring, piece holding and swapping mechanics and also level progression and difficulty scaling. Ensuring good styling and responsive design.

## Installation

To install the program, you need to clone the repository as follows:

1. git clone https://github.com/iabbas96/my-tetris-game.git
2. You will see the following files namely: index.html, style.css, tetris_logic.js, renderer.js, controller.js
3. Ensure all files are in the same directory
4. Double click on the index.html file, it will load automatically on your browser.
5. From there you can now start playing the game.

## Usage

To use the game, the following steps are required:

1. Initialization: The game will start immediately after double clicking the index.html file, the Game starts within 3-second countdown
2. Then follow the instruction that is display in the game area.
3. by using the keyboard, Arrow keys for controlling the movements.
4. the Letter C, for hold a particular tetromino and then swapping it later in the game when needed.
5. the letter P for pausing the game.
6. the ESC key for quitting the game.

### The Core Team

By: ABBAS IBRAHIM

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
