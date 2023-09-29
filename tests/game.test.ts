import { Coordinates } from '../src/coordinates';
import { Game } from '../src/game';

describe('Game', () => {
    test('constructor()', () => {
        const game = new Game(1000, 800);

        expect(game.width).toBe(1000);
        expect(game.height).toBe(800);
        expect(game.ship.position).toEqual(new Coordinates(1000 * 0.5, 800 * 0.9));
        expect(game.renderables).toContain(game.ship);
    });
});