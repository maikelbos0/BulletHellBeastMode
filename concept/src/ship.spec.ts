import { Coordinates } from './coordinates';
import { Direction } from './direction';
import { Ship } from './ship';
import { Velocity } from './velocity';

describe('Ship', () => {
    it.each([
        // Stopped
        [Direction.None, new Velocity(0, 0)],

        // Moving
        [Direction.Up, new Velocity(0, -1000)],
        [Direction.Down, new Velocity(0, 1000)],
        [Direction.Left, new Velocity(-1000, 0)],
        [Direction.Right, new Velocity(1000, 0)],

        // Moving in multiple directions
        [Direction.Up | Direction.Left, new Velocity(-707.1068, -707.1068)],
        [Direction.Down | Direction.Right, new Velocity(707.1068, 707.1068)],
        [Direction.Up | Direction.Down | Direction.Left | Direction.Right, new Velocity(0, 0)],
    ])('getDirectionalVelocity() direction: %p, expectedResult: %p', (direction: Direction, expectedResult: Velocity) => {
        const subject = new Ship(new Coordinates(100, 100));

        const result = subject.getDirectionalVelocity(direction);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        [new Coordinates(1000, 1000), new Coordinates(1000, 1000), new Velocity(0, 0)],
        [new Coordinates(1000, 1000), new Coordinates(1500, 1000), new Velocity(1000, 0)],
        [new Coordinates(1000, 1000), new Coordinates(1000, 500), new Velocity(0, -1000)],
        [new Coordinates(1000, 1000), new Coordinates(1300, 1400), new Velocity(600, 800)],
        [new Coordinates(1000, 1000), new Coordinates(600, 700), new Velocity(-800, -600)]
    ])('getVelocityFromDesiredPosition desiredPosition: %p, expectedResults: %p', (startingPosition: Coordinates, desiredPosition: Coordinates, expectedResult: Velocity) => {
        const subject = new Ship(startingPosition);

        const result = subject.getVelocityFromDesiredPosition(desiredPosition);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        // Directions
        [new Coordinates(500, 500), new Velocity(100, 0), Direction.Right, null, 1, new Velocity(1000, 0)],
        [new Coordinates(500, 500), new Velocity(100, 0), Direction.Right, null, 0.1, new Velocity(300, 0)],
        [new Coordinates(500, 500), new Velocity(0, 0), Direction.Right | Direction.Down, null, 0.1, new Velocity(141.4214, 141.4214)],

        // Desired position
        [new Coordinates(500, 500), new Velocity(100, 0), Direction.None, new Coordinates(1000, 500), 1, new Velocity(1000, 0)],
        [new Coordinates(500, 500), new Velocity(100, 0), Direction.None, new Coordinates(1000, 500), 0.1, new Velocity(300, 0)],
        [new Coordinates(500, 500), new Velocity(0, 0), Direction.None, new Coordinates(1000, 1000), 0.1, new Velocity(141.4214, 141.4214)],

        // Combined
        [new Coordinates(500, 500), new Velocity(100, 0), Direction.Right, new Coordinates(1000, 500), 0.1, new Velocity(300, 0)],
        [new Coordinates(500, 500), new Velocity(0, 0), Direction.Left, new Coordinates(500, 1000), 0.1, new Velocity(-141.4214, 141.4214)],

        // Velocity limit
        [new Coordinates(500, 500), new Velocity(1000, 0), Direction.Right, null, 1, new Velocity(1000, 0)],
        [new Coordinates(500, 500), new Velocity(500, 0), Direction.Right, null, 1, new Velocity(1000, 0)],

        // Decelerating
        [new Coordinates(500, 500), new Velocity(1000, 0), Direction.None, null, 1, new Velocity(0, 0)],
        [new Coordinates(500, 500), new Velocity(1000, 0), Direction.None, null, 0.2, new Velocity(600, 0)],
        [new Coordinates(500, 500), new Velocity(-150, -200), Direction.None, null, 0.1, new Velocity(-30, -40)],

        // Stopped
        [new Coordinates(500, 500), new Velocity(0, 0), Direction.None, null, 1, new Velocity(0, 0)],

        // Boundary checks
        [new Coordinates(900, 500), new Velocity(1000, 0), Direction.Right, null, 0.1, new Velocity(400, 0)],
        [new Coordinates(100, 500), new Velocity(-1000, 0), Direction.Left, null, 0.1, new Velocity(-400, 0)],
        [new Coordinates(500, 900), new Velocity(0, 1000), Direction.Down, null, 0.1, new Velocity(0, 400)],
        [new Coordinates(500, 100), new Velocity(0, -1000), Direction.Up, null, 0.1, new Velocity(0, -400)],
        [new Coordinates(900, 900), new Velocity(1000, 1000), Direction.Right | Direction.Down, null, 0.1, new Velocity(400, 400)],
    ])('processInput() startingPosition: %p, startingVelocity: %p, direction: %p, desiredPosition: %p, duration: %p, expectedVelocity: %p', 
            (startingPosition: Coordinates, startingVelocity: Velocity, direction: Direction, desiredPosition: Coordinates | null, duration: number, expectedVelocity: Velocity) => {
        const subject = new Ship(startingPosition);

        subject.velocity = startingVelocity;

        subject.processInput(direction, desiredPosition, duration);
        
        expect(subject.velocity).toEqual(expectedVelocity);
    });

    test('processFrame()', () => {
        const subject = new Ship(new Coordinates(500, 500));

        subject.velocity = new Velocity(-200, 200);

        subject.processFrame(0.5);

        expect(subject.position).toEqual(new Coordinates(400, 600));
    });
});
