import { Acceleration } from '../src/acceleration';
import { Coordinates } from '../src/coordinates';
import { Direction } from '../src/direction';
import { Ship } from '../src/ship';
import { Velocity } from '../src/velocity';

describe('Ship', () => {
    it.each([
        // Stopped
        [new Velocity(0, 0), Direction.None, 5, true, new Acceleration(0, 0)],

        // Accelerating
        [new Velocity(0, 0), Direction.Up, 5, true, new Acceleration(0, -700)],
        [new Velocity(0, 0), Direction.Down, 5, true, new Acceleration(0, 700)],
        [new Velocity(0, 0), Direction.Left, 5, true, new Acceleration(-700, 0)],
        [new Velocity(0, 0), Direction.Right, 5, true, new Acceleration(700, 0)],

        // Accelerating in multiple directions
        [new Velocity(0, 0), Direction.Up | Direction.Left, 5, true, new Acceleration(-700, -700)],
        [new Velocity(0, 0), Direction.Down | Direction.Right, 5, true, new Acceleration(700, 700)],
        [new Velocity(0, 0), Direction.Up | Direction.Down | Direction.Left | Direction.Right, 5, true, new Acceleration(0, 0)],

        // Decelerating
        [new Velocity(1000, 1000), Direction.None, 1, true, new Acceleration(-700, -700)],
        [new Velocity(-1000, -1000), Direction.None, 1, true, new Acceleration(700, 700)],
        [new Velocity(700, 700), Direction.None, 1, true, new Acceleration(-700, -700)],
       
        // Decelerating along a single axis
        [new Velocity(0, 1000), Direction.Left, 1, true, new Acceleration(-700, -700)],
        [new Velocity(0, 1000), Direction.Right, 1, true, new Acceleration(700, -700)],
        [new Velocity(1000, 0), Direction.Up, 1, true, new Acceleration(-700, -700)],
        [new Velocity(1000, 0), Direction.Down, 1, true, new Acceleration(-700, 700)],
        
        // Decelerating towards zero
        [new Velocity(600, 500), Direction.None, 1, true, new Acceleration(-600, -500)],
        [new Velocity(-600, -500), Direction.None, 1, true, new Acceleration(600, 500)],
        [new Velocity(600, 500), Direction.None, 2, true, new Acceleration(-300, -250)],

        // Don't allow deceleration
        [new Velocity(1000, 1000), Direction.None, 1, false, new Acceleration(0, 0)],
    ])('getDirectionalAcceleration() velocity: %p, direction: %p, duration: %p, allowDeceleration: %p, expectedResult: %p', (velocity: Velocity, direction: Direction, duration: number, allowDeceleration: boolean, expectedResult: Acceleration) => {
        let subject = new Ship(new Coordinates(100, 100));
        
        subject.velocity = velocity;

        let result = subject.getDirectionalAcceleration(direction, duration, allowDeceleration);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        // Directional acceleration
        [new Coordinates(100, 100), new Velocity(100, 100), Direction.Down | Direction.Right, new Acceleration(0, 0), 0.5, new Velocity(450, 450), new Coordinates(237.5, 237.5)],
        [new Coordinates(100, 100), new Velocity(100, 100), Direction.None, new Acceleration(0, 0), 0.2, new Velocity(100, 100), new Coordinates(120, 120)],
        [new Coordinates(100, 100), new Velocity(340, 240), Direction.None, null, 0.2, new Velocity(200, 100), new Coordinates(154, 134)],

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
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, new Acceleration(0, 0), 1, new Velocity(0, 0), new Coordinates(100, 100)],
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.Up, new Acceleration(0, 0), 1, new Velocity(0, -700), new Coordinates(100, -250)],
        // [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, new Acceleration(40, 60), 1, new Velocity(40, 60), new Coordinates(120, 130)]
    ])('processFrame() startingPosition: %p, startingVelocity: %p, direction: %p, customAcceleration: %p, duration: %p, expectedVelocity: %p, expectedPosition: %p', 
            (startingPosition: Coordinates, startingVelocity: Velocity, direction: Direction, customAcceleration: Acceleration | null, duration: number, expectedVelocity: Velocity, expectedPosition: Coordinates) => {
        let subject = new Ship(startingPosition);

        subject.velocity = startingVelocity;

        subject.processFrame(direction, customAcceleration, duration);
        
        expect(subject.velocity).toEqual(expectedVelocity);
        expect(subject.position).toEqual(expectedPosition);
    });
});
