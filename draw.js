var canvas, radius, ctx, centerX, centerY, ratio, numberOfSlices;
$(document).ready(function () {
    canvas = document.getElementById("canvas");
    radius = Math.floor(Math.min(canvas.width, canvas.height) / 2);
    ctx = canvas.getContext("2d");
    centerX = Math.floor(canvas.width / 2);
    centerY = Math.floor(canvas.height / 2);
    ratio = 5 / 4;
    numberOfSlices = $('#slices').val();
    $('#slices').on('input', function () {
        numberOfSlices = $(this).val();
        reDrawSlices();
    });
});

function drawBaseLine() {
    baseLength = radius / ratio + radius;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, baseLength);
    ctx.stroke();
    ctx.beginPath();
    if (ratio != -1) {
        ctx.arc(centerX, baseLength, radius / 50, 0, 2 * Math.PI);
    }
    else {
        ctx.arc(centerX, centerY, radius / 50, 0, 2 * Math.PI);
    }
    ctx.fill();
}

function lineAtAngle(angle) {
    angle -= Math.PI / 2;
    if (ratio != -1) {
        baseLength = radius / ratio + radius;
    }
    else {
        baseLength = radius;
    }
    ctx.moveTo(centerX, baseLength);
    ctx.lineTo(centerX + 2 * radius * Math.cos(angle), baseLength + 2 * radius * Math.sin(angle));
    ctx.stroke();
}

function calcNewRatio(x, y) {
    dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (dist != 0) {
        ratio = radius / dist;
    }
    else {
        ratio = -1;
    }
}

function draw() {
    drawBaseLine();
    if (ratio != -1) {
        var degg = getDegreesArray(ratio, numberOfSlices);
    }
    else {
        var degg = [];
        for (i = 0; i <= numberOfSlices; i++) {
            degg.push(2 * Math.PI / numberOfSlices * (i + 1));
        }
    }
    degg.forEach(function (x) {
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
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function calcTransformDegree(x, y) {
    h = distance(x, y, centerX, centerY);
    o = distance(x, y, centerX, centerY + radius / ratio);
    f = radius / ratio;
    cosine = (o ** 2 - h ** 2 - f ** 2) / (2 * h * f);
    if (x <= centerX)
        return Math.PI - Math.acos(cosine);
    return -(Math.PI - Math.acos(cosine));
}

$(document).ready(function (e) {
    draw();
    $('#canvas_wrapper').mousemove(function (e) {
        var posX = e.pageX - $(this).offset().left, posY = e.pageY - $(this).offset().top;
        if (distance(posX, posY, centerX, centerY) < radius / 50)
            posX = centerX, posY = centerY;
        trans = calcTransformDegree(posX, posY) * 180 / Math.PI;
        reDraw(posX, posY);
        $('#canvas').css({ 'transform': 'rotate(' + trans + 'deg)' });
    });
});

function sineEquation(ratio, k, theta, n) {
    return Math.sin(theta) - ratio * (n * 2 * Math.PI / k - theta);
}

function sineDerivative(ratio, theta) {
    return Math.cos(theta) + ratio;
}

function newton(ratio, k, x0, n, presicion) {
    x1 = x0 - sineEquation(ratio, k, x0, n, presicion) / sineDerivative(ratio, x0);
    if (Math.abs(sineEquation(ratio, k, x1, n, presicion)) < presicion)
        return x1;
    return newton(ratio, k, x1, n, presicion);
}

function getDegreesArray(ratio, k) {
    n = -1
    if (k % 2 == 1) {
        n = Math.floor(k / 2);
    }
    else {
        n = k / 2 - 1;
    }
    var degrees = [];
    degrees.push(0);
    for (i = 1; i <= n; i++) {
        if (i == 1)
            x0 = Math.PI * 2 / k;
        else
            x0 = degrees[i - 2] + Math.PI * 2 / k;
        degrees.push(newton(ratio, k, x0, i, 0.0001));
    }
    if (k % 2 == 0)
        degrees.push(Math.PI);
    mapper = function (theta) { return theta - Math.asin(Math.sin(theta) / Math.sqrt(1 + ratio * ratio + 2 * ratio * Math.cos(theta))) };
    var degrees_std = degrees.map(mapper);
    return degrees_std;
}
