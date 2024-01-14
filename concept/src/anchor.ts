import { Coordinates } from './coordinates.js';
import { Polygon } from './polygon.js';

export interface Anchor {
    position: Coordinates;
    polygons: Polygon[];
}
