import { Background } from './background.js';
import { Coordinates } from './coordinates.js';
import { Renderable } from './renderable.js';
import { Ship } from './ship.js';

export class Game {
    static readonly deathAnimationDuration: number = 2;
    static readonly width: number = 1000;
    static readonly height: number = 1000;

    readonly ship: Ship;
    readonly renderables: Renderable[];

    constructor() {
        this.ship = new Ship(new Coordinates(Game.width * 0.5, Game.height * 0.9));
        this.renderables = [this.ship, new Background()];
    }

    renderFrame(context: CanvasRenderingContext2D, duration: number): void {
        context.clearRect(0, 0, Game.width, Game.height);

        this.renderables.forEach(renderable => renderable.processFrame(duration));
        this.renderables.forEach(renderable => renderable.render(context));
    }
}