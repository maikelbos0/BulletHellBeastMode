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

    limitMagnitude(maximumMagnitude: number): Vector {
        const magnitude = this.getMagnitude();
        let factor = 1;

        if (magnitude > maximumMagnitude){
            factor = maximumMagnitude / magnitude;
        }

        return new Vector(this.x * factor, this.y * factor);
    }
}
