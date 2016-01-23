"use strict";

var canvas, ctx, chance;
var buckets = new Map();

var BUCKET_SIZE = 400;

function init(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    chance = new Chance(30);
}

buckets.at = function at(x, y){
    var hash = Math.floor(x/BUCKET_SIZE) + "," + Math.floor(y/BUCKET_SIZE);
    if(!buckets.has(hash)){
        buckets.set(hash, []);
    }
    return buckets.get(hash);
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
    var start;

    if(buckets.at(0,0).length == 0){
        start = new Point(0, 100)
        angle = - Math.PI / 4;
        size = 20;
    }
    else {
        var start_bucket = [];
        while(start_bucket.length == 0)
            var start_bucket = chance.pick(Array.from(buckets.values()));
        var start_street = chance.pick(Array.from(start_bucket));
        start = chance.pick(start_street.points);
        size = Math.max(3,chance.floating({min: -7, max: 0}) + start_street.size);
    }

    var previous = start;
    for(var i = 0; i < 10*size; i++){
        angle += chance.floating({min:-4/size, max: 4/size});
        var dist = chance.floating({min: size, max: 8 * size})
        var point = new Point(previous.x + Math.cos(angle) * dist, previous.y - Math.sin(angle) * dist);
        buckets.at(point.x, point.y).unshift(new Street([previous, point], size));
        previous = point;
    }
}

function render(){
    var html = document.querySelector('html');
    var height = html.clientHeight;
    var width = html.clientWidth;
    canvas.height = height;
    canvas.width = width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";


    var segcount = 0;

    var visible_buckets = [];
    for(var x = 0; x < canvas.width; x+= BUCKET_SIZE)
        for(var y = 0; y < canvas.width; y+= BUCKET_SIZE)
            visible_buckets.push(buckets.at(x, y));

    for(var bucket of visible_buckets){
        for(var street of bucket){
            ctx.strokeStyle = "#888";
            if(street.size <= 5){
            ctx.strokeStyle = "#aaa";
            }
            ctx.lineWidth = street.size+1;
            ctx.beginPath();
            ctx.moveTo(street.points[0].x, street.points[0].y);
            ctx.lineTo(street.points[1].x, street.points[1].y);
            ctx.stroke();
            segcount++;
        }
    }
    for(var bucket of visible_buckets){
        for(var street of bucket){
            if(street.size <= 5) continue
            ctx.strokeStyle = "#eee";
            if(street.size > 15) ctx.strokeStyle = "#ec9";
            ctx.lineWidth = street.size;
            ctx.beginPath();
            ctx.moveTo(street.points[0].x, street.points[0].y);
            ctx.lineTo(street.points[1].x, street.points[1].y);
            ctx.stroke();
            segcount++;
        }
    }

    // debug shit
    ctx.strokeStyle = ctx.fillStyle = "blue";
    ctx.fillText(segcount + " segments", 0, 50)
    ctx.lineWidth = 1;
    for(var key of buckets.keys()){
        var coords = key.split(",");
        ctx.fillText(key, coords[0] * BUCKET_SIZE, coords[1] * BUCKET_SIZE + 10);
        ctx.strokeRect(coords[0] * BUCKET_SIZE + .5, coords[1] * BUCKET_SIZE + .5, BUCKET_SIZE, BUCKET_SIZE);
    }

    window.requestAnimationFrame(render);
}

init();
render();
//while(streets.length < 2000) mk_street();
window.setInterval(mk_street, 300);
