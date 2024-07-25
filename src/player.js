const Gameboard = require('./gameboard');

class Player {
    constructor () {
        this.gameboard = new Gameboard();
    }
}

module.exports = Player;