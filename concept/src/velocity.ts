import { Acceleration } from './acceleration.js';
import { Vector } from './vector.js';

export class Velocity extends Vector {
    constructor(x: number, y: number) {
        super(x, y);
    }

    accelerate(aceleration: Acceleration, duration: number) {
        return new Velocity(
            this.x + aceleration.x * duration,
            this.y + aceleration.y * duration
        );
    }

    getAcceleration(duration: number): Acceleration {
        return new Acceleration(this.x / duration, this.y / duration);
    }
}
