export class Vector {
    readonly x: number;
    readonly y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    limitMagnitude(maximumMagnitude: number): this {
        const magnitude = this.getMagnitude();
        let factor = 1;

        if (magnitude > maximumMagnitude){
            factor = maximumMagnitude / magnitude;
        }

        return new (this.constructor as any)(this.x * factor, this.y * factor);
    }

    add(vector: Vector): this {
        return new (this.constructor as any)(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector): this {
        return new (this.constructor as any)(this.x - vector.x, this.y - vector.y);
    }
}
