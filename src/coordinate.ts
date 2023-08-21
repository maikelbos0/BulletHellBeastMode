import { Velocity } from './velocity';

export class Coordinate {
    readonly x: number;
    readonly y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    move(velocity: Velocity, duration: number): Coordinate {
        return new Coordinate(
            this.x + velocity.x * duration,
            this.y + velocity.y * duration
        );
    }
}