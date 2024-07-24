class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.coordinates = [undefined, undefined];
        this.horizontal = true;
        this.hitCount = 0;
        this.sunk = false;
    }

    hit() {
        this.hitCount += 1;
    }

    isSunk() {
        return this.hitCount === this.length;
    }
}

module.exports = Ship;