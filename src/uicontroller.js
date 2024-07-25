const Player = require('./player');
const Ship = require('./ship')

class UIController {
    constructor() {
        this.playerOne = new Player();
        this.playerTwo = new Player();
        // this.playerOneTurn = null;
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
        
        const playerOneBoardArea = document.getElementById('player-one-board-area')

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
    }
}

module.exports = UIController;