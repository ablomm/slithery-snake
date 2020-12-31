/*
Copyright 2020 Andrew Blommestyn. All Rights Reserved
andrewblommestyn.com
*/

class Apple extends Circle {
    constructor() {
        const __radius__ = 20;
        super(randomInt(__radius__ * 3, width - __radius__ * 3), randomInt(__radius__ * 3, height - __radius__ * 3), __radius__); //make apple 3 times it's radius from the edges
    }

    //true if the snake ate the apple
    isEaten() {
        if (snake.segments.tail != null) {
            return this.isCircleinCircle(new Circle(snake.position.x, snake.position.y, snake.width / 2));
        }
    }

}