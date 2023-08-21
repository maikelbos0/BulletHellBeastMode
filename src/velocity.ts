import { Acceleration } from './acceleration';
import { Vector } from './vector';

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
}
