
const Gameboard = require('./gameboard');
const Ship = require('./ship');

let gameboard;

beforeEach(() => {
    gameboard = new Gameboard();
});

test('placeShip horizontally', () => {
    const ship = gameboard.ships[4];
    gameboard.placeShip(ship, 0, 0)
    expect(gameboard.gameboard[0][0].name).toBe('Destroyer');
    expect(gameboard.gameboard[1][0].name).toBe('Destroyer');
});

test('placeShip vertically', () => {
    const ship = gameboard.ships[3];
    ship.horizontal = false;
    gameboard.placeShip(ship, 1, 1)
    expect(gameboard.gameboard[1][1].name).toBe('Submarine');
    expect(gameboard.gameboard[1][2].name).toBe('Submarine');
    expect(gameboard.gameboard[1][3].name).toBe('Submarine');
});

test('receiveAttack hits a ship', () => {
    const ship = gameboard.ships[3];
    gameboard.placeShip(ship, 0, 0);
    expect(gameboard.gameboard[0][0] instanceof Ship).toBe(true);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.gameboard[0][0]).toBe('hit');
    expect(ship.hitCount).toBe(1);
});

test('receiveAttack misses a ship', () => {
    const ship = gameboard.ships[3];
    gameboard.placeShip(ship, 0, 0);
    expect(gameboard.gameboard[5][5] instanceof Ship).toBe(false);
    gameboard.receiveAttack(5, 5);
    expect(gameboard.gameboard[5][5]).toBe('miss');
    expect(ship.hitCount).toBe(0);
});

test('check allShipsSunk', () => {
    gameboard.ships.forEach(ship => {
        while(!ship.isSunk()) {
            ship.hit();
        }
    })
    
    expect(gameboard.allShipsSunk()).toBe(true);
});

test('check !allShipsSunk', () => {
    expect(gameboard.allShipsSunk()).toBe(false);
});