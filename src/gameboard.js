const Ship = require('./ship');

class Gameboard { 
    constructor() {
        this.gameboard = new Array(10).fill(null).map(() => new Array(10).fill(null));
        this.missedAttacks = 0;

        //1990 Milton Bradley version of Battleship rules
        this.ships = [
            new Ship('Carrier', 5), //0
            new Ship('Battleship', 4), //1
            new Ship('Cruiser', 3), //2
            new Ship('Submarine', 3), //3
            new Ship('Destroyer', 2), //4
        ]
    }

    placeShip(ship, x, y) {
        ship.coordinates = [x,y];
        if(ship.horizontal) {
            for(let i = 0; i < ship.length; i++) {
                this.gameboard[x + i][y] = ship;
            }
        }
        else {
            for(let i = 0; i < ship.length; i++) {
                this.gameboard[x][y + i] = ship;
            }
        }
    }

    receiveAttack(x, y) {
        if(this.gameboard[x][y] instanceof Ship) {
            const attackedShip = this.gameboard[x][y];
            attackedShip.hit();
            this.gameboard[x][y] = 'hit';
        }
        else {
            this.missedAttacks += 1;
            this.gameboard[x][y] = 'miss';
        }
    }
}


module.exports = Gameboard;