export class Vector {
    static precision: number = 4;

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = this.round(x);
        this.y = this.round(y);
    }

    round(value: number) {
        return Math.round(value * Math.pow(10, Vector.precision)) / Math.pow(10, Vector.precision);
    }

    equals(vector: this): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    hasMagnitude(): boolean {
        return this.x != 0 || this.y != 0;
    }

    getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    limitMagnitude(maximumMagnitude: number): this {
        const magnitude = this.getMagnitude();
        let factor = 1;

        if (magnitude > maximumMagnitude) {
            factor = maximumMagnitude / magnitude;
        }

        return new (this.constructor as any)(this.x * factor, this.y * factor);
    }

    adjustMagnitude(newMagnitude: number): this {
        const magnitude = this.getMagnitude();
        const factor = newMagnitude / magnitude;

        return new (this.constructor as any)(this.x * factor, this.y * factor);
    }

    add(vector: this): this {
        return new (this.constructor as any)(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: this): this {
        return new (this.constructor as any)(this.x - vector.x, this.y - vector.y);
    }

    divide(divisor: number): this {
        return new (this.constructor as any)(this.x / divisor, this.y / divisor);
    }

    dotProduct(vector: this): number {
        return this.x * vector.x + this.y * vector.y;
    }
}
