import { Coordinates } from './coordinates';
import { Game } from './game';
import { RenderingContext } from './rendering-context';

describe('Game', () => {
    test('constructor()', () => {
        const subject = new Game({} as RenderingContext);

        expect(subject.ship.position).toEqual(new Coordinates(500, 900));
        expect(subject.renderables).toContain(subject.ship);

        // TODO expand tests for rendering, background?
    });
});