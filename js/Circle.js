/*
Copyright 2020 Andrew Blommestyn. All Rights Reserved
andrewblommestyn.com
*/

class Circle {
    constructor(centerX, centerY, radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
    }

    draw(color) {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    //true if a given point is within the circle, false otherwise
    isPointInCircle(x, y) {
        let distancesquared = (x - this.centerX) * (x - this.centerX) + (y - this.centerY) * (y - this.centerY);
        return distancesquared <= this.radius ** 2;
    }

    //true if a given circle is intersecting the circle, false otherwise
    isCircleinCircle(other) {
        let centerDistanceSquared = (this.centerX - other.centerX) ** 2 + (this.centerY - other.centerY) ** 2
        return (this.radius - other.radius) ** 2 <= centerDistanceSquared && centerDistanceSquared <= (this.radius + other.radius) ** 2
    }
}