import { Acceleration } from '../src/acceleration';
import { Coordinates } from '../src/coordinates';
import { Direction } from '../src/direction';
import { Ship } from '../src/ship';
import { Velocity } from '../src/velocity';

describe('Ship', () => {
    it.each([
        // Direction
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up, new Acceleration(0, 0), 1, new Coordinates(150, 125), new Velocity(50, 0)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Down, new Acceleration(0, 0), 1, new Coordinates(150, 175), new Velocity(50, 100)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Left, new Acceleration(0, 0), 1, new Coordinates(125, 150), new Velocity(0, 50)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Right, new Acceleration(0, 0), 1, new Coordinates(175, 150), new Velocity(100, 50)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Down | Direction.Right, new Acceleration(0, 0), 1, new Coordinates(175, 175), new Velocity(100, 100)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up | Direction.Left, new Acceleration(0, 0), 1, new Coordinates(125, 125), new Velocity(0, 0)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up | Direction.Down | Direction.Left | Direction.Right, new Acceleration(0, 0), 1, new Coordinates(150, 150), new Velocity(50, 50)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Down, new Acceleration(0, 0), 2, new Coordinates(200, 300), new Velocity(50, 150)],

        // Custom acceleration
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(40, 60), 1, new Coordinates(170, 180), new Velocity(90, 110)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(-40, -60), 2, new Coordinates(120, 80), new Velocity(-30, -70)],

        // Combined direction and custom acceleration
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up, new Acceleration(80, 20), 1, new Coordinates(190, 135), new Velocity(130, 20)],

        // Acceleration limit
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(400, 300), 1, new Coordinates(190, 180), new Velocity(130, 110)],

        // Speed limit
        [new Coordinates(100, 100), new Velocity(360, 270), Direction.None, new Acceleration(80, 60), 1, new Coordinates(480, 385), new Velocity(400, 300)],
    ])('processFrame() startingPosition: %p, startingVelocity: %p, direction: %p, customAcceleration: %p, duration: %p, expectedPosition: %p, expectedVelocity: %p', 
            (startingPosition: Coordinates, startingVelocity: Velocity, direction: Direction, customAcceleration: Acceleration, duration: number, expectedPosition: Coordinates, expectedVelocity: Velocity) => {
        let subject = new Ship(startingPosition);

        subject.speed = startingVelocity;

        subject.processFrame(direction, customAcceleration, duration);
        
        expect(subject.position.x).toBe(expectedPosition.x);
        expect(subject.position.y).toBe(expectedPosition.y);
        expect(subject.speed.x).toBe(expectedVelocity.x);
        expect(subject.speed.y).toBe(expectedVelocity.y);
    });
});
