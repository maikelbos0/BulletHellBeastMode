export class Vector {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    getSpeed(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
