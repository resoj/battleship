const Player = require('./player');
const Ship = require('./ship')

class UIController {
    constructor() {
        this.playerOne = new Player();
        this.playerTwo = new Player();
        // this.playerOneTurn = null;
    }

    controller() {
        this.loadStartScreen();
    }

    loadStartScreen() {
        const gameArea = document.getElementById('game-area');

        const startButton = document.createElement('button');
        startButton.classList.add('start-button');
        startButton.textContent = 'START';

        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            gameArea.style.display = 'grid';
            this.loadGameBoards();
        })

        gameArea.appendChild(startButton);
    }

    getCoordinateAvailability(playerGameboard, ship, x, y) {
        const isOutOfBounds = (x, y) => x < 0 || x > 9 || y < 0 || y > 9;
        
        if (ship.horizontal) {
            for (let i = 0; i < ship.length; i++) {
                if (isOutOfBounds(x + i, y) || playerGameboard[x + i][y] !== null) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (isOutOfBounds(x, y + i) || playerGameboard[x][y + i] !== null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    randomizeShipCoordinates(playerGameboard) {
        const getRandomCoordinate = () => Math.floor(Math.random() * 10);
    
        playerGameboard.ships.forEach(ship => {
            let x, y;
    
            // Find valid coordinates
            do {
                x = getRandomCoordinate();
                y = getRandomCoordinate();
            } while (!this.getCoordinateAvailability(playerGameboard.gameboard, ship, x, y));
    
            playerGameboard.placeShip(ship, x, y);
        });
    }

    loadGameBoards() {

        const playerOneGameboard = this.playerOne.gameboard;
        const playerTwoGameboard = this.playerTwo.gameboard;

        this.randomizeShipCoordinates(playerOneGameboard);
        this.randomizeShipCoordinates(playerTwoGameboard);
        
        const playerOneBoardArea = document.getElementById('player-one-board-area');
        const playerTwoBoardArea = document.getElementById('player-two-board-area');

        playerOneBoardArea.style.display = 'grid';
        playerTwoBoardArea.style.display = 'grid';

        playerOneGameboard.gameboard.forEach(boardRow => {
            boardRow.forEach(boardElement => {
                const gridCell = document.createElement('div');
                gridCell.classList.add('grid-cell');
                if(boardElement instanceof Ship) {
                    gridCell.style.backgroundColor = 'gray';
                    gridCell.textContent = boardElement.name;
                }
                playerOneBoardArea.appendChild(gridCell);
            })
        })

        playerTwoGameboard.gameboard.forEach(boardRow => {
            boardRow.forEach(boardElement => {
                const gridCell = document.createElement('div');
                gridCell.classList.add('grid-cell');
                playerTwoBoardArea.appendChild(gridCell);
            })
        })
    }

    resetGameBoards() {
        const playerOneBoardArea = document.getElementById('player-one-board-area');

        while(playerOneBoardArea.firstChild) {
            playerOneBoardArea.removeChild(playerOneBoardArea.firstChild);
        }
    }
}

module.exports = UIController;