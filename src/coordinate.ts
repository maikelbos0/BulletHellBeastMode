import { Vector } from './vector';

export class Coordinate {
    readonly x: number;
    readonly y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    move(vector: Vector, duration: number): Coordinate {
        return new Coordinate(
            this.x + vector.x * duration,
            this.y + vector.y * duration
        );
    }
}