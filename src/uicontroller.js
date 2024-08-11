const Player = require('./player');
const Ship = require('./ship');

class UIController {
    constructor() {
        this.playerOne = new Player();
        this.playerTwo = new Player();
    }

    initialize() {
        this.loadStartScreen();
    }

    loadStartScreen() {
        const gameArea = document.getElementById('game-area');
        const startButton = this.createButton('PLAY', ['start-button']);
        startButton.addEventListener('click', () => {
            this.startGame(startButton, gameArea);
        });
        gameArea.appendChild(startButton);
    }

    startGame(startButton, gameArea) {
        startButton.style.display = 'none';
        gameArea.style.display = 'grid';
        this.displayPlayerNames(gameArea);
        this.setupGameBoards();
    }

    displayPlayerNames(gameArea) {
        const playerNames = gameArea.querySelectorAll('p');
        playerNames.forEach(playerName => playerName.style.display = 'flex');
    }

    setupGameBoards() {
        this.randomizeShips(this.playerOne.gameboard);
        this.randomizeShips(this.playerTwo.gameboard);

        this.renderBoard('player-one-board-area', this.playerOne.gameboard, true);
        this.renderBoard('player-two-board-area', this.playerTwo.gameboard, false);
    }

    createButton(text, classNames = []) {
        const button = document.createElement('button');
        button.textContent = text;
        classNames.forEach(className => button.classList.add(className));
        return button;
    }

    isOutOfBounds(x, y, ship, horizontal) {
        if (horizontal) {
            return x < 0 || x + ship.length > 10 || y < 0 || y > 9;
        }
        return x < 0 || x > 9 || y < 0 || y + ship.length > 10;
    }

    isPlacementValid(playerGameboard, ship, x, y) {
        if (this.isOutOfBounds(x, y, ship, ship.horizontal)) return false;

        for (let i = 0; i < ship.length; i++) {
            const occupied = ship.horizontal ? playerGameboard[x + i][y] : playerGameboard[x][y + i];
            if (occupied !== null) return false;
        }
        return true;
    }

    randomizeShips(playerGameboard) {
        const getRandomCoordinate = () => Math.floor(Math.random() * 10);
        const getRandomOrientation = () => Math.random() >= 0.5;

        playerGameboard.ships.forEach(ship => {
            let x, y;
            do {
                x = getRandomCoordinate();
                y = getRandomCoordinate();
                ship.horizontal = getRandomOrientation();
            } while (!this.isPlacementValid(playerGameboard.gameboard, ship, x, y));
            playerGameboard.placeShip(ship, x, y);
        });
    }

    renderBoard(boardId, gameboard, isPlayer) {
        const boardArea = document.getElementById(boardId);
        boardArea.style.display = 'grid';

        gameboard.gameboard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const gridCell = this.createGridCell(cell, isPlayer, rowIndex, colIndex);
                boardArea.appendChild(gridCell);
            });
        });
    }

    createGridCell(cell, isPlayer, rowIndex, colIndex) {
        const gridCell = document.createElement('button');
        gridCell.classList.add('grid-cell');
        gridCell.dataset.row = rowIndex;
        gridCell.dataset.col = colIndex;

        if (isPlayer) {
            if (cell instanceof Ship) {
                gridCell.textContent = cell.name;
                gridCell.style.backgroundColor = 'var(--ship-color)';
                gridCell.style.border = 'none';
            }
        } else {
            gridCell.addEventListener('click', () => this.handleAttack(rowIndex, colIndex, gridCell));
        }
        return gridCell;
    }

    handleAttack(x, y, gridCell) {
        if (!gridCell.classList.contains('attacked')) {
            const cell = this.playerTwo.gameboard.gameboard[x][y];
            const color = cell ? this.markHit(cell) : this.markMiss();
            gridCell.style.backgroundColor = color;
            gridCell.classList.add('attacked');
            this.playerTwo.gameboard.gameboard[x][y] = cell ? 'hit' : 'miss';
            this.randomEnemyAttack();
        }
    }

    markHit(ship) {
        ship.hit();
        return 'var(--hit-color)';
    }

    markMiss() {
        return 'var(--miss-color)';
    }

    randomEnemyAttack() {
        let x, y;
        const getRandomCoordinate = () => Math.floor(Math.random() * 10);
        let cell;
    
        do {
            x = getRandomCoordinate();
            y = getRandomCoordinate();
            cell = this.playerOne.gameboard.gameboard[x][y];
        } while (cell === 'hit' || cell === 'miss');
    
        this.receiveAttack(x, y);
    }

    receiveAttack(x, y) {
        const cell = this.playerOne.gameboard.gameboard[x][y];
        const color = cell ? this.markHit(cell) : this.markMiss();
        const gridCell = document.querySelector(`#player-one-board-area .grid-cell[data-row="${x}"][data-col="${y}"]`);
    
        if (gridCell && !gridCell.classList.contains('attacked')) {
            gridCell.classList.add('attacked');
            gridCell.style.backgroundColor = color;
    
            this.playerOne.gameboard.gameboard[x][y] = cell ? 'hit' : 'miss';
        }
    }

    resetGameBoards() {
        ['player-one-board-area', 'player-two-board-area'].forEach(boardId => {
            const boardArea = document.getElementById(boardId);
            while (boardArea.firstChild) {
                boardArea.removeChild(boardArea.firstChild);
            }
        });
    }
}

module.exports = UIController;
