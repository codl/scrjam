"use strict";

var canvas, ctx, streets, chance;

function init(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    chance = new Chance(0);

    streets = [];
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

function mk_street(){
    var size;
    var angle = chance.random() * 2 * Math.PI;
    var points = []

    var start, end;

    if(streets.length == 0){
        start = new Point(0, 100)
        angle = - Math.PI / 4;
        size = 20;
    }
    else {
        var start_street = chance.pick(streets);
        start = chance.pick(start_street.points);
        size = Math.max(3,chance.floating({min: -7, max: 0}) + start_street.size);
    }

    var previous = start;
    points.push(start);
    for(var i = 0; i < size; i++){
        angle += chance.floating({min:-4/size, max: 4/size});
        var dist = chance.floating({min: size, max: 8 * size})
        var point = new Point(previous.x + Math.cos(angle) * dist, previous.y - Math.sin(angle) * dist);
        points.push(point);
        previous = point;
    }

    streets.unshift(new Street(points, size));
}

function render(){
    var html = document.querySelector('html');
    var height = html.clientHeight;
    var width = html.clientWidth;
    canvas.height = height;
    canvas.width = width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    for(var street of streets){
        ctx.strokeStyle = "#888";
        if(street.size <= 5){
        ctx.strokeStyle = "#aaa";
        }
        ctx.lineWidth = street.size+1;
        ctx.beginPath();
        ctx.moveTo(street.points[0].x, street.points[0].y);
        for(var point of street.points.slice(1)){
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke()

    }
    for(var street of streets){
        if(street.size <= 5) continue
        ctx.strokeStyle = "#eee";
        if(street.size > 15) ctx.strokeStyle = "#ec9";
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

init();
render();
window.setInterval(mk_street, 100);
