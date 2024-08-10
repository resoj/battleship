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
        startButton.textContent = 'PLAY';

        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            gameArea.style.display = 'grid';
            this.loadGameBoards();
        })

        gameArea.appendChild(startButton);
    }

    getCoordinateAvailability(playerGameboard, ship, x, y) {
        const isOutOfBounds = (x, y, ship, horizontal) => {
            if (horizontal) {
                return x < 0 || x + ship.length > 10 || y < 0 || y > 9;
            } else {
                return x < 0 || x > 9 || y < 0 || y + ship.length > 10;
            }
        };
    
        if (isOutOfBounds(x, y, ship, ship.horizontal)) {
            return false;
        }
    
        for (let i = 0; i < ship.length; i++) {
            if (ship.horizontal) {
                if (playerGameboard[x + i][y] !== null) {
                    return false;
                }
            } else {
                if (playerGameboard[x][y + i] !== null) {
                    return false;
                }
            }
        }
    
        return true;
    }
    
    randomizeShipCoordinates(playerGameboard) {
        const getRandomCoordinate = () => Math.floor(Math.random() * 10);
        const getRandomOrientation = () => Math.random() >= .5;
    
        playerGameboard.ships.forEach(ship => {
            let x, y, horizontal;
    
            // Find valid coordinates
            do {
                x = getRandomCoordinate();
                y = getRandomCoordinate();
                horizontal = getRandomOrientation();
                ship.horizontal = horizontal;
            } while (!this.getCoordinateAvailability(playerGameboard.gameboard, ship, x, y));
    
            playerGameboard.placeShip(ship, x, y);
        });
    }

    loadGameBoards() {

        const gameArea = document.getElementById('game-area');
        const playerNames = gameArea.querySelectorAll('p');
        
        playerNames.forEach(playerName => {
            playerName.style.display = 'flex';
        })

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
                const gridCell = document.createElement('button');
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
                const gridCell = document.createElement('button');
                gridCell.classList.add('grid-cell');
                playerTwoBoardArea.appendChild(gridCell);
                gridCell.addEventListener('click', () => {
                    if(boardElement === null) {
                        gridCell.style.backgroundColor = 'gray';
                    }
                    else {
                        boardElement.hit();
                        gridCell.style.backgroundColor = 'red';
                    }
                });
            })
        })

        console.log(playerOneGameboard.gameboard);
    }

    resetGameBoards() {
        const playerOneBoardArea = document.getElementById('player-one-board-area');
        const playerTwoBoardArea = document.getElementById('player-two-board-area');

        while(playerOneBoardArea.firstChild && playerTwoBoardArea.firstChild) {
            playerOneBoardArea.removeChild(playerOneBoardArea.firstChild);
            playerTwoBoardArea.removeChild(playerTwoBoardArea.firstChild);
        }
    }
}

module.exports = UIController;