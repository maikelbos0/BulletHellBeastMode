import { Acceleration } from '../src/acceleration';
import { Coordinates } from '../src/coordinates';
import { Direction } from '../src/direction';
import { Ship } from '../src/ship';
import { Velocity } from '../src/velocity';

describe('Ship', () => {
    it.each([
        // Stopped
        [new Velocity(0, 0), Direction.None, 5, new Acceleration(0, 0)],

        // Accelerating
        [new Velocity(0, 0), Direction.Up, 5, new Acceleration(0, -200)],
        [new Velocity(0, 0), Direction.Down, 5, new Acceleration(0, 200)],
        [new Velocity(0, 0), Direction.Left, 5, new Acceleration(-200, 0)],
        [new Velocity(0, 0), Direction.Right, 5, new Acceleration(200, 0)],

        // Accelerating in multiple directions
        [new Velocity(0, 0), Direction.Up | Direction.Left, 5, new Acceleration(-200, -200)],
        [new Velocity(0, 0), Direction.Down | Direction.Right, 5, new Acceleration(200, 200)],
        [new Velocity(0, 0), Direction.Up | Direction.Down | Direction.Left | Direction.Right, 5, new Acceleration(0, 0)],

        // Decelerating
        [new Velocity(300, 300), Direction.None, 1, new Acceleration(-200, -200)],
        [new Velocity(-300, -300), Direction.None, 1, new Acceleration(200, 200)],
        [new Velocity(200, 200), Direction.None, 1, new Acceleration(-200, -200)],
        
        // Decelerating along a single axis
        [new Velocity(0, 200), Direction.Left, 1, new Acceleration(-200, -200)],
        [new Velocity(0, 200), Direction.Right, 1, new Acceleration(200, -200)],
        [new Velocity(200, 0), Direction.Up, 1, new Acceleration(-200, -200)],
        [new Velocity(200, 0), Direction.Down, 1, new Acceleration(-200, 200)],
        
        // Decelerating towards zero
        [new Velocity(150, 100), Direction.None, 1, new Acceleration(-150, -100)],
        [new Velocity(-150, -100), Direction.None, 1, new Acceleration(150, 100)],
    ])('getDirectionalAcceleration() directionalVelocity: %p, direction: %p, duration: %p, expectedResult: %p', (directionalVelocity: Velocity, direction: Direction, duration: number, expectedResult: Acceleration) => {
        let subject = new Ship(new Coordinates(100, 100));
        
        subject.directionalVelocity = directionalVelocity;

        let result = subject.getDirectionalAcceleration(direction, duration);

        expect(result).toEqual(expectedResult);
    });

    it.each([
        // Direction
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up, new Acceleration(0, 0), 1, new Velocity(50, -150), new Coordinates(150, 50)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Down, new Acceleration(0, 0), 1, new Velocity(50, 250), new Coordinates(150, 250)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Left, new Acceleration(0, 0), 1, new Velocity(-150, 50), new Coordinates(50, 150)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Right, new Acceleration(0, 0), 1, new Velocity(250, 50), new Coordinates(250, 150)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Down | Direction.Right, new Acceleration(0, 0), 1, new Velocity(250, 250), new Coordinates(250, 250)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up | Direction.Left, new Acceleration(0, 0), 1, new Velocity(-150, -150), new Coordinates(50, 50)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up | Direction.Down | Direction.Left | Direction.Right, new Acceleration(0, 0), 1, new Velocity(50, 50), new Coordinates(150, 150)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Down, new Acceleration(0, 0), 2, new Velocity(50, 450), new Coordinates(200, 600)],

        // Custom acceleration
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(40, 60), 1, new Velocity(90, 110), new Coordinates(170, 180)],
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(-40, -60), 2, new Velocity(-30, -70), new Coordinates(120, 80)],

        // Combined direction and custom acceleration
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.Up, new Acceleration(80, 20), 1, new Velocity(130, -130), new Coordinates(190, 60)],

        // Acceleration limit
        [new Coordinates(100, 100), new Velocity(50, 50), Direction.None, new Acceleration(400, 300), 1, new Velocity(290, 230), new Coordinates(270, 240)],

        // Velocity limit
        [new Coordinates(100, 100), new Velocity(360, 270), Direction.None, new Acceleration(80, 60), 1, new Velocity(400, 300), new Coordinates(480, 385)],

        // Deceleration
        [new Coordinates(100, 100), new Velocity(400, 300), Direction.None, new Acceleration(0, 0), 1, new Velocity(160, 120), new Coordinates(380, 310)],
        [new Coordinates(100, 100), new Velocity(-400, -300), Direction.None, new Acceleration(0, 0), 1, new Velocity(-160, -120), new Coordinates(-180, -110)],
        [new Coordinates(100, 100), new Velocity(400, 300), Direction.None, new Acceleration(0, 0), 2, new Velocity(0, 0), new Coordinates(433.3333, 350)],
        [new Coordinates(100, 100), new Velocity(60, 45), Direction.None, new Acceleration(0, 0), 0.5, new Velocity(0, 0), new Coordinates(107.5, 105.625)],

        // Stopped
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, new Acceleration(0, 0), 1, new Velocity(0, 0), new Coordinates(100, 100)],
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.Up, new Acceleration(0, 0), 1, new Velocity(0, -200), new Coordinates(100, 0)],
        [new Coordinates(100, 100), new Velocity(0, 0), Direction.None, new Acceleration(40, 60), 1, new Velocity(40, 60), new Coordinates(120, 130)]
    ])('processFrame() startingPosition: %p, startingVelocity: %p, direction: %p, customAcceleration: %p, duration: %p, expectedVelocity: %p, expectedPosition: %p', 
            (startingPosition: Coordinates, startingVelocity: Velocity, direction: Direction, customAcceleration: Acceleration, duration: number, expectedVelocity: Velocity, expectedPosition: Coordinates) => {
        let subject = new Ship(startingPosition);

        subject.velocity = startingVelocity;

        subject.processFrame(direction, customAcceleration, duration);
        
        expect(subject.velocity).toEqual(expectedVelocity);
        expect(subject.position).toEqual(expectedPosition);
    });
});
