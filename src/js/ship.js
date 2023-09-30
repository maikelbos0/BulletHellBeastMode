import { Direction } from './direction.js';
import { Velocity } from './velocity.js';
export class Ship {
    constructor(startingPosition) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }
    getDirectionalVelocity(direction) {
        let velocity = new Velocity(0, 0);
        if ((direction & Direction.Up) == Direction.Up) {
            velocity = velocity.add(new Velocity(0, -Ship.maximumSpeed));
        }
        if ((direction & Direction.Down) == Direction.Down) {
            velocity = velocity.add(new Velocity(0, Ship.maximumSpeed));
        }
        if ((direction & Direction.Left) == Direction.Left) {
            velocity = velocity.add(new Velocity(-Ship.maximumSpeed, 0));
        }
        if ((direction & Direction.Right) == Direction.Right) {
            velocity = velocity.add(new Velocity(Ship.maximumSpeed, 0));
        }
        return velocity;
    }
    getVelocityFromDesiredPosition(desiredPosition) {
        let positionDelta = desiredPosition.subtract(this.position);
        let distance = positionDelta.getMagnitude();
        if (distance == 0) {
            return new Velocity(0, 0);
        }
        else if (distance > Ship.stoppingDistance) {
            return new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(Ship.maximumSpeed);
        }
        else {
            let stoppingTime = Math.sqrt(2 * distance / Ship.maximumAcceleration);
            return new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(distance / stoppingTime);
        }
    }
    processInput(direction, desiredPosition, duration) {
        let desiredVelocity = this.getDirectionalVelocity(direction);
        if (desiredPosition != null) {
            desiredVelocity = desiredVelocity.add(this.getVelocityFromDesiredPosition(desiredPosition));
        }
        let velocityDelta = desiredVelocity.subtract(this.velocity);
        let acceleration = velocityDelta.getAcceleration(duration).limitMagnitude(Ship.maximumAcceleration);
        this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
    }
    processFrame(duration) {
        this.position = this.position.move(this.velocity, duration);
    }
    /*
    -20	  5	-10	  0
    -10	  0	 -5	  5
     -5	  5	  0	-20
      0	-20	  5	  5
      5	  5  10	  0
     10	  0	 20	  5
     20	  5  15	 10
     15	 10	  5	  5
      5	  5  0	 15
      0	 15 -5	  5
     -5	  5	-15	 10
    -15	 10	-20	  5
    -20	  5	-20	 -5
    -20	 -5	-15	 10
    
    -10	-10	  0	  5
      0	  5	 10	-10
     10	-10	 10	  0
    
     20	 -5	 20	  5
     20	 -5	 15	 10
    
    -10	-10	-10	  0
    
    */
    render(context) {
        context.beginPath();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2;
        context.moveTo(this.position.x - 20, this.position.y + 5);
        context.lineTo(this.position.x - 10, this.position.y);
        context.lineTo(this.position.x - 5, this.position.y + 5);
        context.lineTo(this.position.x, this.position.y - 20);
        context.lineTo(this.position.x + 5, this.position.y + 5);
        context.lineTo(this.position.x + 10, this.position.y);
        context.lineTo(this.position.x + 20, this.position.y + 5);
        context.lineTo(this.position.x + 15, this.position.y + 10);
        context.lineTo(this.position.x + 5, this.position.y + 5);
        context.lineTo(this.position.x, this.position.y + 15);
        context.lineTo(this.position.x - 5, this.position.y + 5);
        context.lineTo(this.position.x - 15, this.position.y + 10);
        context.lineTo(this.position.x - 20, this.position.y + 5);
        context.lineTo(this.position.x - 20, this.position.y - 5);
        context.lineTo(this.position.x - 15, this.position.y + 10);
        context.moveTo(this.position.x - 10, this.position.y - 10);
        context.lineTo(this.position.x, this.position.y + 5);
        context.lineTo(this.position.x + 10, this.position.y - 10);
        context.lineTo(this.position.x + 10, this.position.y);
        context.moveTo(this.position.x + 20, this.position.y + 5);
        context.lineTo(this.position.x + 20, this.position.y - 5);
        context.lineTo(this.position.x + 15, this.position.y + 10);
        context.moveTo(this.position.x - 10, this.position.y - 10);
        context.lineTo(this.position.x - 10, this.position.y);
        context.stroke();
    }
}
Ship.maximumSpeed = 1000;
Ship.maximumAcceleration = 2000;
Ship.stoppingDistance = Ship.maximumAcceleration / 2 * Math.pow(Ship.maximumSpeed / Ship.maximumAcceleration, 2);
//# sourceMappingURL=ship.js.map