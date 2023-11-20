import { Coordinates } from '../src/coordinates';
import { Game } from '../src/game';

describe('Game', () => {
    test('constructor()', () => {
        const subject = new Game();

        expect(subject.ship.position).toEqual(new Coordinates(500, 900));
        expect(subject.renderables).toContain(subject.ship);
    });
});