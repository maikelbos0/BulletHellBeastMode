export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    limitMagnitude(maximumMagnitude) {
        const magnitude = this.getMagnitude();
        let factor = 1;
        if (magnitude > maximumMagnitude) {
            factor = maximumMagnitude / magnitude;
        }
        return new this.constructor(this.x * factor, this.y * factor);
    }
    adjustMagnitude(newMagnitude) {
        const magnitude = this.getMagnitude();
        const factor = newMagnitude / magnitude;
        return new this.constructor(this.x * factor, this.y * factor);
    }
    add(vector) {
        return new this.constructor(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return new this.constructor(this.x - vector.x, this.y - vector.y);
    }
}
//# sourceMappingURL=vector.js.map