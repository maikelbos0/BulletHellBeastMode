import { Vector } from './vector';

export class Acceleration extends Vector {
    constructor(x: number, y: number) {
        super(x, y);
    }

    add(value: Acceleration) {
        return new Acceleration(this.x + value.x, this.y + value.y);
    }
}
