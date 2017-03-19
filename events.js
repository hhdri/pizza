$(document).ready(function(e) {
    draw();
    $('#canvas_wrapper').mousemove(function(e) {
        var posX = e.pageX - $(this).offset().left, posY = e.pageY - $(this).offset().top;
        if(distance(posX, posY, centerX, centerY) < radius / 50)
            posX = centerX, posY = centerY;
        trans = calcTransformDegree(posX, posY) * 180 / Math.PI;
        reDraw(posX, posY);
        $('#canvas').css({'transform':'rotate('+trans+'deg)'});
    });
});
