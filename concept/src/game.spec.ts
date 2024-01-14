import { Coordinates } from './coordinates';
import { Game } from './game';

describe('Game', () => {
    test('constructor()', () => {
        const subject = new Game();

        expect(subject.ship.position).toEqual(new Coordinates(500, 900));
        expect(subject.renderables).toContain(subject.ship);
    });
});