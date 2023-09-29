import { Coordinates } from './coordinates.js';

export interface Renderable {
    position: Coordinates;

    render(context: CanvasRenderingContext2D): void;
}