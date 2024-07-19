export class Ship {
    constructor(shipLength) {
        this.shipLength = shipLength;
        this.hitCount = 0;
    }

    hit() {
        this.hitCount += 1;
    }

    isSunk() {
        if(this.hitCount === this.shipLength) {
            return true;
        }
        return false;
    }
}