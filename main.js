"use strict";

var canvas, ctx, streets;

function init(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    streets = [];

    streets.push(new Street([
        new Point(-10,7),
        new Point(10,10),
        new Point(21, 40),
        new Point(40, 70),
        new Point(90, 95),
        new Point(150, 80),
        new Point(250, -10),
    ], 7))
    streets.push(new Street([
        new Point(30,-4),
        new Point(10,10),
    ], 7))
    streets.push(new Street([
        new Point(-10, 100),
        new Point(40,70),
        new Point(100, 50),
        new Point(170, -20),
    ], 16))
}

function Point(x, y){
    if(!this){
        return new Point(x, y);
    }
    this.x = x;
    this.y = y;
}

function Street(points, size){
    if(!this){
        return new Street(points, size);
    }
    this.points = points;
    this.size = size;
}

function render(){
    canvas.height = document.querySelector("html").clientHeight
    canvas.width = document.querySelector("html").clientWidth
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#555";
    for(var street of streets){
        ctx.lineWidth = street.size+1;
        ctx.beginPath();
        ctx.moveTo(street.points[0].x, street.points[0].y);
        for(var point of street.points.slice(1)){
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke()

    }
    ctx.strokeStyle = "#eee";
    for(var street of streets){
        ctx.lineWidth = street.size;
        ctx.beginPath();
        ctx.moveTo(street.points[0].x, street.points[0].y);
        for(var point of street.points.slice(1)){
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke()
    }
    window.requestAnimationFrame(render);
}

function mkstreet(){
}

init();
render();


