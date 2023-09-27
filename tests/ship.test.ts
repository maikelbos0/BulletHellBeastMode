import { Acceleration } from '../src/acceleration';
import { Coordinates } from '../src/coordinates';
import { Direction } from '../src/direction';
import { Ship } from '../src/ship';
import { Velocity } from '../src/velocity';

describe('Ship', () => {
    it.each([
        // Stopped
        [Direction.None, new Velocity(0, 0)],

        // Moving
        [Direction.Up, new Velocity(0, -700)],
        [Direction.Down, new Velocity(0, 700)],
        [Direction.Left, new Velocity(-700, 0)],
        [Direction.Right, new Velocity(700, 0)],

        // Moving in multiple directions
        [Direction.Up | Direction.Left, new Velocity(-700, -700)],
        [Direction.Down | Direction.Right, new Velocity(700, 700)],
        [Direction.Up | Direction.Down | Direction.Left | Direction.Right, new Velocity(0, 0)],
    ])('getDirectionalVelocity() direction: %p, expectedResult: %p', (direction: Direction, expectedResult: Velocity) => {
        let subject = new Ship(new Coordinates(100, 100));

        let result = subject.getDirectionalVelocity(direction);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        [new Coordinates(1000, 1000), new Coordinates(1000, 1000), new Velocity(0, 0)],
        [new Coordinates(1000, 1000), new Coordinates(1500, 1000), new Velocity(700, 0)],
        [new Coordinates(1000, 1000), new Coordinates(1000, 500), new Velocity(0, -700)],
        [new Coordinates(1000, 1000), new Coordinates(1300, 1400), new Velocity(420, 560)],
        [new Coordinates(1000, 1000), new Coordinates(600, 700), new Velocity(-560, -420)]
    ])('getVelocityFromDesiredPosition desiredPosition: %p, expectedResults: %p', (startingPosition: Coordinates, desiredPosition: Coordinates, expectedResult: Velocity) => {
        let subject = new Ship(startingPosition);

        let result = subject.getVelocityFromDesiredPosition(desiredPosition);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        // Directions
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.Right, null, 1, new Velocity(700, 0), new Coordinates(800, 100)],
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.Right, null, 0.1, new Velocity(200, 0), new Coordinates(120, 100)],
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.Right | Direction.Down, null, 0.1, new Velocity(70.7107, 70.7107), new Coordinates(107.0711, 107.0711)],

        // Desired position
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.None, new Coordinates(1000, 100), 1, new Velocity(700, 0), new Coordinates(800, 100)],
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.None, new Coordinates(1000, 100), 0.1, new Velocity(200, 0), new Coordinates(120, 100)],
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, new Coordinates(1000, 1000), 0.1, new Velocity(70.7107, 70.7107), new Coordinates(107.0711, 107.0711)],

        // Combined
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.Right, new Coordinates(1000, 100), 0.1, new Velocity(200, 0), new Coordinates(120, 100)],
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.Left, new Coordinates(100, 1000), 0.1, new Velocity(-70.7107, 70.7107), new Coordinates(92.9289, 107.0711)],

        // Velocity limit
        [new Coordinates(100, 100), new Velocity(700, 0), Direction.Right, null, 1, new Velocity(700, 0), new Coordinates(800, 100)],
        [new Coordinates(100, 100), new Velocity(350, 0), Direction.Right, null, 1, new Velocity(700, 0), new Coordinates(800, 100)],

        // Decelerating
        [new Coordinates(100, 100), new Velocity(700, 0), Direction.None, null, 1, new Velocity(0, 0), new Coordinates(100, 100)],
        [new Coordinates(100, 100), new Velocity(700, 0), Direction.None, null, 0.5, new Velocity(200, 0), new Coordinates(200, 100)],
        [new Coordinates(100, 100), new Velocity(-150, -200), Direction.None, null, 0.1, new Velocity(-90, -120), new Coordinates(91, 88)],

        // Stopped
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, null, 1, new Velocity(0, 0), new Coordinates(100, 100)],
    ])('processFrame() startingPosition: %p, startingVelocity: %p, direction: %p, desiredPosition: %p, duration: %p, expectedVelocity: %p, expectedPosition: %p', 
            (startingPosition: Coordinates, startingVelocity: Velocity, direction: Direction, desiredPosition: Coordinates | null, duration: number, expectedVelocity: Velocity, expectedPosition: Coordinates) => {
        let subject = new Ship(startingPosition);

        subject.velocity = startingVelocity;

        subject.processFrame(direction, desiredPosition, duration);
        
        expect(subject.velocity).toEqual(expectedVelocity);
        expect(subject.position).toEqual(expectedPosition);
    });
});
