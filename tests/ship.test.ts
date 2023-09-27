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
        // Directional acceleration
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.Right, null, 1, new Velocity(700, 0), new Coordinates(800, 100)],
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.Right, null, 0.1, new Velocity(200, 0), new Coordinates(120, 100)],
        [new Coordinates(100, 100), new Velocity(100, 0), Direction.Right, null, 0.05, new Velocity(150, 0), new Coordinates(107.5, 100)],

        // TODO expand test coverage, include multi direction +/- desired position, and clean up old code

        //[new Coordinates(100, 100), new Velocity(100, 100), Direction.None, new Coordinates(100, 100), 0.2, new Velocity(100, 100), new Coordinates(120, 120)],
        //[new Coordinates(100, 100), new Velocity(340, 240), Direction.None, null, 0.2, new Velocity(200, 100), new Coordinates(154, 134)],

        // Custom acceleration
        // [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(40, 60), 1, new Velocity(90, 110), new Coordinates(170, 180)],
        // [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(-40, -60), 2, new Velocity(-30, -70), new Coordinates(120, 80)],

        // Combined direction and custom acceleration
        // [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up, new Acceleration(80, 20), 1, new Velocity(130, -130), new Coordinates(190, 60)],

        // Acceleration limit
        // [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(400, 300), 1, new Velocity(290, 230), new Coordinates(270, 240)],

        // Velocity limit
        // [new Coordinates(100, 100), new Velocity(360, 270), Direction.None, new Acceleration(80, 60), 1, new Velocity(400, 300), new Coordinates(480, 385)],

        // Stopped
        //[new Coordinates(100, 100), new Velocity(0, 0), Direction.None, null, 1, new Velocity(0, 0), new Coordinates(100, 100)],
        //[new Coordinates(100, 100), new Velocity(0, 0), Direction.Up, null, 1, new Velocity(0, -700), new Coordinates(100, -250)],
        // [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, new Acceleration(40, 60), 1, new Velocity(40, 60), new Coordinates(120, 130)]
    ])('processFrame() startingPosition: %p, startingVelocity: %p, direction: %p, desiredPosition: %p, duration: %p, expectedVelocity: %p, expectedPosition: %p', 
            (startingPosition: Coordinates, startingVelocity: Velocity, direction: Direction, desiredPosition: Coordinates | null, duration: number, expectedVelocity: Velocity, expectedPosition: Coordinates) => {
        let subject = new Ship(startingPosition);

        subject.velocity = startingVelocity;

        subject.processFrame(direction, desiredPosition, duration);
        
        expect(subject.velocity).toEqual(expectedVelocity);
        expect(subject.position).toEqual(expectedPosition);
    });
});
