import { Coordinates } from './coordinates.js';

export class LineSegment {
    constructor(
        public readonly a: Coordinates,
        public readonly b: Coordinates
    ) { }

    intersectsLine(c: Coordinates, d: Coordinates): boolean {
        const uA = ((d.x - c.x) * (this.a.y - c.y) - (d.y - c.y) * (this.a.x - c.x)) / ((d.y - c.y) * (this.b.x - this.a.x) - (d.x - c.x) * (this.b.y - this.a.y));
        //Needed if we ever need to check segment/segment intersection
        //const uB = ((this.b.x - this.a.x) * (this.a.y - c.y) - (this.b.y - this.a.y) * (this.a.x - c.x)) / ((d.y - c.y) * (this.b.x - this.a.x) - (d.x - c.x) * (this.b.y - this.a.y));

        return (uA >= 0 && uA <= 1);
    }
}
