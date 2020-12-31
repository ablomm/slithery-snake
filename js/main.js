/*
Copyright 2020 Andrew Blommestyn. All Rights Reserved
andrewblommestyn.com
*/

//scene variables
const ctx = canvas.getContext("2d");
let width;
let height;

//game variables
let score = 0;
let snake;
let apple;

//animation variables
let lastRender = 0;
let currentAnimation; //holds id of the current animation so it can be canceled if paused

//Point class for holding data for body segements of snake
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //returns the distance squared between two points
    distanceSquared(other) {
        return (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
    }
}

//when user resizes window
const resize = function () {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.onresize = resize;
resize();

//returns random int from start to end exlcuding end
function randomInt(start, end) {
    return Math.floor(start + Math.random() * (end - start));
}

//keyboard controls
function keyDown(event) {
    if (snake != null) {
        switch (event.keyCode) {
            case 83: //s
            case 40: //down
            case 68: //d
            case 39: //right
                snake.rotation.clockwise = true;
                break;
            case 87: //w
            case 38: //up
            case 65: //a
            case 37: //left
                snake.rotation.counterClockwise = true;
                break;
            case 32: //space REMEMBER TO REMOVE
                snake.setEatTime(500);
                break;
        }
    }
}

function keyUp(event) {
    if (snake != null) {
        switch (event.keyCode) {
            case 83: //s
            case 40: //down
            case 68: //d
            case 39: //right
                snake.rotation.clockwise = false;
                break;
            case 87: //w
            case 38: //up
            case 65: //a
            case 37: //left
                snake.rotation.counterClockwise = false;
                break;
            case 80:
                pause();
        }
    }
}

//tap controls (for phone)
function touch(event) {
    if (snake != null) {
        let evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
        let touch = evt.touches[0] || evt.changedTouches[0];

        snake.rotation.clockwise = touch.pageX >= width / 2;
        snake.rotation.counterClockwise = !snake.rotation.clockwise;
    }
}

function touchEnd(event) {
    if (snake != null) {
        snake.rotation.clockwise = false;
        snake.rotation.counterClockwise = false;
    }
}

//controls events
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.addEventListener("touchmove", touch);
window.addEventListener("touchstart", touch);
window.addEventListener("touchend", touchEnd);

//updates object locations
function update(progress) {
    snake.update(progress);
}

//draws objects
function draw() {
    //reset canvas
    ctx.clearRect(0, 0, width, height);

    //draw everything
    apple.draw('red');
    snake.draw(darkThemeSettings ? "white" : "black");
}

//main loop
function loop(timestamp) {
    const progress = (timestamp - lastRender) / 16.7; //progress = frametime/16.7 = 1 at 60fps

    update(progress);
    draw();
    lastRender = timestamp; //updates the lastRender time

    if (!snake.checkHit()) { //not dead
        currentAnimation = window.requestAnimationFrame(loop); //animate next frame
    } else { //dead :(
        updateScores(); //update html stores
        endGameAnimation();
    }
}

//resets and enables canvas objects and animations
function start() {
    ctx.clearRect(0, 0, width, height);
    apple = new Apple();
    snake = new Snake();
    score = 0;
    enable();
}

//starts animation
function enable() {
    lastRender = window.performance.now(); //Makes it so the progress isn't a large number because we weren't rendering for when the menues were up
    window.requestAnimationFrame(loop);
}
