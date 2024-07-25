
require('./style.css');

// Import modules
const Player = require('./player.js');
const Gameboard = require('./gameboard.js');
const Ship = require('./ship.js');

const playerOne = new Player();
const playerTwo = new Player();

const playerOneGameboard = playerOne.gameboard;
const playerTwoGameboard = playerTwo.gameboard;

//Set Ships up
let index = 0;

playerOneGameboard.ships.forEach(ship => {
    playerOneGameboard.placeShip(ship, index, index);
    // playerTwoGameboard.placeShip(ship, index, index);
    index += 1;
})


const playerOneBoardArea = document.getElementById('player-one-board-area');

playerOneGameboard.gameboard.forEach(gridX => {
    gridX.forEach(gridY => {
        const gridCell = document.createElement('div');
        gridCell.classList.add('grid-cell');
        if(gridY instanceof Ship) {
            gridCell.style.backgroundColor = 'gray';
            gridCell.textContent = gridY.name;
        }
        playerOneBoardArea.appendChild(gridCell);
    })
})