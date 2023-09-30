import { Background } from './background.js';
import { Coordinates } from './coordinates.js';
import { Ship } from './ship.js';
export class Game {
    constructor() {
        this.ship = new Ship(new Coordinates(Game.width * 0.5, Game.height * 0.9));
        this.renderables = [this.ship, new Background()];
    }
    renderFrame(context, duration) {
        context.clearRect(0, 0, Game.width, Game.height);
        this.renderables.forEach(renderable => renderable.processFrame(duration));
        this.renderables.forEach(renderable => renderable.render(context));
    }
}
Game.width = 1000;
Game.height = 1000;
//# sourceMappingURL=game.js.map