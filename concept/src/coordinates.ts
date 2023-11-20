import { Vector } from './vector.js';
import { Velocity } from './velocity.js';

export class Coordinates extends Vector {
    constructor(x: number, y: number) {
        super(x, y);
    }

    move(velocity: Velocity, duration: number): Coordinates {
        return new Coordinates(
            this.x + velocity.x * duration,
            this.y + velocity.y * duration
        );
    }
}
