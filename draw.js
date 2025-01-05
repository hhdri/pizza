var radius, ctx, centerX, centerY, ratio, numberOfSlices;

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const canvasWrapper = document.getElementById("canvas_wrapper");
    radius = Math.floor(Math.min(canvas.width, canvas.height) / 2);
    ctx = canvas.getContext("2d");
    centerX = Math.floor(canvas.width / 2);
    centerY = Math.floor(canvas.height / 2);
    ratio = 4 / 5;

    numberOfSlices = document.getElementById("slices").value;

    draw();

    document.getElementById("slices").addEventListener("input", function () {
        numberOfSlices = this.value;
        draw();
    });

    canvasWrapper.addEventListener("mousemove", function (e) {
        const rect = canvasWrapper.getBoundingClientRect();
        let posX = e.clientX - rect.left;
        let posY = e.clientY - rect.top;

        ratio = distance(posX, posY, centerX, centerY) / radius;

        const trans = (calcTransformDegree(posX, posY) * 180) / Math.PI;
        canvas.style.transform = `rotate(${trans}deg)`;

        draw();
    });
});

function draw() {
    baseLength = radius * ratio + radius;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, baseLength);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, baseLength, radius / 50, 0, 2 * Math.PI);
    ctx.fill();
    for (let i = 0; i < numberOfSlices / 2; i++) {
        const x = solve(i / numberOfSlices, ratio);
        ctx.moveTo(centerX, baseLength);
        ctx.lineTo(centerX + 2 * radius * Math.sin(x), baseLength - 2 * radius * Math.cos(x));
        ctx.stroke();

        ctx.moveTo(centerX, baseLength);
        ctx.lineTo(centerX - 2 * radius * Math.sin(x), baseLength - 2 * radius * Math.cos(x));
        ctx.stroke();
    }
    if (numberOfSlices % 2 == 0) {
        ctx.moveTo(centerX, baseLength);
        ctx.lineTo(centerX, baseLength + 2 * radius);
        ctx.stroke();
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function calcTransformDegree(x, y) {
    h = distance(x, y, centerX, centerY);
    o = distance(x, y, centerX, centerY + radius * ratio);
    f = radius * ratio;
    cosine = (o ** 2 - h ** 2 - f ** 2) / (2 * h * f);
    if (x <= centerX)
        return Math.PI - Math.acos(cosine);
    return -(Math.PI - Math.acos(cosine));
}

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
    if (funcVal >= 0.5) {
        throw new Error("funcVal must be < 0.5");
    }

    let alpha = funcVal * 2 * Math.PI;
    while (true) {
        const funcValCur = relAreaFraction(alpha, v);
        if (Math.abs(funcVal - funcValCur) < 1e-4) {
            break;
        }
        let step = -(funcValCur - funcVal) / relAreaFractionDiff(alpha, v)

        step = Math.max(step, -Math.abs(alpha / 2));
        step = Math.min(step, Math.abs(alpha / 2));

        alpha += step;
    }
    return alpha;
}