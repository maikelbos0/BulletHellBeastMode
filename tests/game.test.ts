import { Coordinates } from '../src/coordinates';
import { Game } from '../src/game';

describe('Game', () => {
    test('constructor()', () => {
        const subject = new Game(1000, 800);

        expect(subject.width).toBe(1000);
        expect(subject.height).toBe(800);
        expect(subject.ship.position).toEqual(new Coordinates(1000 * 0.5, 800 * 0.9));
        expect(subject.renderables).toContain(subject.ship);
    });
});