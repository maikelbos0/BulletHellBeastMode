import { Background } from './background.js';
import { Coordinates } from './coordinates.js';
import { Ship } from './ship.js';
export class Game {
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.ship = new Ship(new Coordinates(this.width * 0.5, this.height * 0.9));
        this.renderables = [this.ship, new Background(width, height)];
    }
    renderFrame(context, duration) {
        context.clearRect(0, 0, this.width, this.height);
        this.renderables.forEach(renderable => renderable.processFrame(duration));
        this.renderables.forEach(renderable => renderable.render(context));
    }
}
//# sourceMappingURL=game.js.map