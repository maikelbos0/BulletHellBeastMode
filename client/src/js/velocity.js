import { Acceleration } from './acceleration.js';
import { Vector } from './vector.js';
export class Velocity extends Vector {
    constructor(x, y) {
        super(x, y);
    }
    accelerate(aceleration, duration) {
        return new Velocity(this.x + aceleration.x * duration, this.y + aceleration.y * duration);
    }
    getAcceleration(duration) {
        return new Acceleration(this.x / duration, this.y / duration);
    }
}
//# sourceMappingURL=velocity.js.map