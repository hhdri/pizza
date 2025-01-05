var canvas, radius, ctx, centerX, centerY, ratio, numberOfSlices;

document.addEventListener("DOMContentLoaded", function () {
    canvas = document.getElementById("canvas");
    radius = Math.floor(Math.min(canvas.width, canvas.height) / 2);
    ctx = canvas.getContext("2d");
    centerX = Math.floor(canvas.width / 2);
    centerY = Math.floor(canvas.height / 2);
    ratio = 5 / 4;

    numberOfSlices = document.getElementById("slices").value;

    document.getElementById("slices").addEventListener("input", function () {
        numberOfSlices = this.value;
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
        var degg = [...Array(Math.floor(numberOfSlices/2)+1).keys()].map((i) => solve(i / numberOfSlices, 1 / ratio));
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

document.addEventListener("DOMContentLoaded", function () {
    draw();

    const canvasWrapper = document.getElementById("canvas_wrapper");
    const canvas = document.getElementById("canvas");

    canvasWrapper.addEventListener("mousemove", function (e) {
        const rect = canvasWrapper.getBoundingClientRect();
        let posX = e.clientX - rect.left;
        let posY = e.clientY - rect.top;

        if (distance(posX, posY, centerX, centerY) < radius / 50) {
            posX = centerX;
            posY = centerY;
        }

        const trans = (calcTransformDegree(posX, posY) * 180) / Math.PI;
        reDraw(posX, posY);

        canvas.style.transform = `rotate(${trans}deg)`;
    });
});





function relAreaFraction(alpha, v) {
    const term1 = alpha + Math.asin(v * Math.sin(alpha));
    const numerator = v * Math.sin(term1) + term1;
    return numerator / (2 * Math.PI);
}
function relAreaFractionDiff(alpha, v) {
    const term1 = v * Math.sin(alpha);
    const term2 = Math.sqrt(1 - term1 * term1);
    const numerator =
      (term2 + v * Math.cos(alpha)) *
      (1 + v * Math.cos(alpha + Math.asin(term1)));
    return numerator / (2 * Math.PI * term2);
}
function solve(funcVal, v) {
    if (funcVal == 0.5) {
        return Math.PI;
    }
    if (funcVal > 0.5) {
        throw new Error("funcVal must be < 0.5");
    }
  
    let alpha = funcVal * 2 * Math.PI;
    while (true) {
        const funcValCur = relAreaFraction(alpha, v);
        if (Math.abs(funcVal - funcValCur) < 1e-4) {
        break;
        }
        const grad = -(funcValCur - funcVal) / relAreaFractionDiff(alpha, v);
        alpha += Math.min(
            Math.abs(alpha / 2),
            Math.max(grad, -Math.abs(alpha / 2))
        );
    }
    return alpha;
}
  
  






