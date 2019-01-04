var canvas, radius, ctx, centerX, centerY, ratio, numberOfSlices;
$(document).ready(function() {
    canvas = document.getElementById("canvas");
    radius = Math.floor(Math.min(canvas.width, canvas.height)/2);
    ctx = canvas.getContext("2d");
    centerX = Math.floor(canvas.width/2);
    centerY = Math.floor(canvas.height/2);
    ratio = 5/4;
    numberOfSlices = $('#slices').val();
    $('#slices').on('input', function() {
        numberOfSlices = $(this).val();
        reDrawSlices();
    });
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
    if(ratio != -1) {
        ctx.arc(centerX, baseLength, radius/50, 0, 2 * Math.PI);
    }
    else {
        ctx.arc(centerX, centerY, radius/50, 0, 2 * Math.PI);
    }
    ctx.fill();
}

function lineAtAngle(angle) {
    angle -= Math.PI/2;
    if(ratio != -1) {
        baseLength = radius / ratio + radius;
    }
    else {
        baseLength = radius;
    }
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
    if(dist != 0) {
        ratio = radius / dist;
    }
    else {
        ratio = -1;
    }
}

function draw() {
    drawBaseLine();
    if(ratio != -1) {
        var degg = getDegreesArray(ratio, numberOfSlices);
    }
    else {
        var degg = [];
        for(i=0; i<= numberOfSlices; i++) {
            degg.push(2 * Math.PI / numberOfSlices * (i + 1));
        }
    }
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

function reDrawSlices(posX, posY) {
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
