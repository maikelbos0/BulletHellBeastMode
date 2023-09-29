import { Coordinates } from './coordinates.js';
import { Ship } from './ship.js';
export class Game {
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.ship = new Ship(new Coordinates(this.width * 0.5, this.height * 0.9));
        this.renderables = [this.ship];
    }
    render(context) {
        this.renderables.forEach(renderable => renderable.render(context));
    }
}
//# sourceMappingURL=game.js.map