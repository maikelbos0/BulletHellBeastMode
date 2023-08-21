"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Velocity = void 0;
var vector_1 = require("./vector");
var Velocity = /** @class */ (function (_super) {
    __extends(Velocity, _super);
    function Velocity(x, y) {
        return _super.call(this, x, y) || this;
    }
    Velocity.prototype.accelerate = function (aceleration, duration) {
        return new Velocity(this.x + aceleration.x * duration, this.y + aceleration.y * duration);
    };
    return Velocity;
}(vector_1.Vector));
exports.Velocity = Velocity;
//# sourceMappingURL=velocity.js.map