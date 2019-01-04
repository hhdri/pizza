function sineEquation(ratio, k, theta, n) {
    return Math.sin(theta) - ratio * (n*2*Math.PI/k - theta);
}

function sineDerivative(ratio, theta) {
    return Math.cos(theta) + ratio;
}

function newton(ratio, k, x0, n, presicion) {
    x1 = x0 - sineEquation(ratio, k, x0, n, presicion)/sineDerivative(ratio, x0);
    if(Math.abs(sineEquation(ratio, k, x1, n, presicion)) < presicion)
        return x1;
    return newton(ratio, k, x1, n, presicion);
}

function getDegreesArray(ratio, k) {
    n = -1
    if (k%2 == 1) {
        n = Math.floor(k/2);
    }
    else {
        n = k / 2 - 1;
    }
    var degrees = [];
    degrees.push(0);
    for(i = 1; i <= n; i++) {
        if(i == 1)
            x0 = Math.PI *2/k;
        else
            x0 = degrees[i-2] + Math.PI*2/k;
        degrees.push(newton(ratio, k, x0, i, 0.0001));
    }
    if(k % 2 == 0)
        degrees.push(Math.PI);
    mapper = function(theta) {return theta - Math.asin(Math.sin(theta)/Math.sqrt(1 + ratio * ratio + 2 * ratio * Math.cos(theta)))};
    var degrees_std = degrees.map(mapper);
    return degrees_std;
}
