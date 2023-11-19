export class Vector {
    constructor(x, y) {
        this.x = this.round(x);
        this.y = this.round(y);
    }
    round(value) {
        return Math.round(value * Math.pow(10, Vector.precision)) / Math.pow(10, Vector.precision);
    }
    hasMagnitude() {
        return this.x != 0 || this.y != 0;
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
Vector.precision = 4;
//# sourceMappingURL=vector.js.map