var canvas, radius, ctx, centerX, centerY, ratio;
$(document).ready(function() {
    canvas = document.getElementById("canvas");
    radius = Math.floor(Math.min(canvas.width, canvas.height)/2);
    ctx = canvas.getContext("2d");
    centerX = Math.floor(canvas.width/2);
    centerY = Math.floor(canvas.height/2);
    ratio = 5/4;
});
function drawCircle() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawCenter() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius/50, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBaseLine() {
    baseLength = radius / ratio + radius;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, baseLength);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, baseLength, radius/50, 0, 2 * Math.PI);
    ctx.fill();
}

function lineAtAngle(angle) {
    angle -= Math.PI/2;
    baseLength = radius / ratio + radius;
    ctx.moveTo(centerX, baseLength);
    ctx.lineTo(centerX + 2 * radius * Math.cos(angle), baseLength + 2 * radius * Math.sin(angle));
    ctx.stroke();
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, radius/50, 0, 2*Math.PI);
    ctx.fill();
}

function calcNewRatio(x, y) {
    dist = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
    ratio = radius / dist;
}

function draw() {
    drawCenter();
    drawBaseLine();
    var degg = getDegreesArray(ratio, 7);
    degg.forEach(function(x) {
        lineAtAngle(x);
        lineAtAngle(-x);
    });
}

function reDraw(posX, posY) {
    calcNewRatio(posX, posY);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

function calcTransformDegree(x, y) {
    h = distance(x, y, centerX, centerY);
    o = distance(x, y, centerX, centerY + radius / ratio);
    f = radius / ratio;
    cosine = (o**2-h**2-f**2) / (2*h*f);
    if(x <= centerX)
        return Math.PI - Math.acos(cosine);
    return -(Math.PI - Math.acos(cosine));
}
