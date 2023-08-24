import { Vector } from './vector.js';
export class Coordinates extends Vector {
    constructor(x, y) {
        super(x, y);
    }
    move(velocity, duration) {
        return new Coordinates(this.x + velocity.x * duration, this.y + velocity.y * duration);
    }
}
//# sourceMappingURL=coordinates.js.map