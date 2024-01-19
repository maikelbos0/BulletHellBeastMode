import { Background } from './background.js';
import { Coordinates } from './coordinates.js';
import { Renderable } from './renderable.js';
import { RenderingContext } from './rendering-context.js';
import { Ship } from './ship.js';

export class Game {
    static readonly width: number = 1000;
    static readonly height: number = 1000;

    private readonly background: Background;
    readonly ship: Ship;
    readonly renderables: Renderable[];

    constructor(private context: RenderingContext) {
        this.background = new Background();
        this.ship = new Ship(new Coordinates(Game.width * 0.5, Game.height * 0.9));
        this.renderables = [this.ship, new Background()];
    }

    renderFrame(duration: number): void {
        this.context.clearRectangle(0, 0, Game.width, Game.height);

        this.renderables.forEach(renderable => renderable.processFrame(duration));
        this.renderables.forEach(renderable => renderable.render(this.context));
    }
}
