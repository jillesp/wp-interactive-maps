console.log('theme.js loaded.')

function drawMap(paths) {
    for(var p in paths) {
        s.path(paths[p]).attr({
                'fill': '#3C6D32',
                'data-area': p
            }).mouseover(function(e) {
            this.animate({
                'fill': '#1D3016'
            }, 300, function(){
                var point = this.getBBox();
                var left = (point.x + point.width + 20) * scale;
                var top = (point.y) * scale;
                var layover = $('.layover');
                    layover.css({
                        left: left,
                        top: top
                    })
                    layover.addClass('active');
                    if(layover.css('opacity') > 0 || (!layover.hasClass('active')) ) layover.css('opacity', 0);
                    layover.animate({
                        'opacity': 1
                    }, 300);
            })
        }).mouseout(function(e){
            this.animate({
                'fill': '#3C6D32'
            }, 300, function(){
                var layover = $('.layover');
                    layover.removeClass('active');
                    if(layover.css('opacity') > 0 || (!layover.hasClass('active')) ) layover.css('opacity', 0);
            })
        }).click(function(e){
            // var layover = $('.layover');
            //     layover.addClass('active');
        })
     }
}

var s; var scale = .4;
$(document).ready(function(){
    s = Snap("#snapper");
    // s = Snap("100%", 700);
    // s.attr('viewBox', "0 0 100 100")
    s.attr('transform', "scale("+ scale +")");

    // m = new Snap.Matrix();
    // m.rotate(45)

    $.ajax({
        dataType: "json",
        url: "./assets/rsrc/areas.json",
        success: function(data){
            drawMap(data)
        }
    });

})