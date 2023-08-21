"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordinate = void 0;
var Coordinate = /** @class */ (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.move = function (vector, duration) {
        return new Coordinate(this.x + vector.x * duration, this.y + vector.y * duration);
    };
    return Coordinate;
}());
exports.Coordinate = Coordinate;
//# sourceMappingURL=coordinate.js.map