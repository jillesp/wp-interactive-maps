console.log('theme.js loaded.')

// init vars

var s; var content;

function drawMap(paths) {
    for(var p in paths) {
        s.path(paths[p]).attr({
                'fill': fill,
                'data-area': p
            }).mouseover(function(e) {
            this.animate({
                'fill': hover_fill
            }, 300, function(){

                // display content box
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
                
                // pull content
                    for(var c in content) {
                        if( c == this.attr('data-area') ) {
                            var img, title, desc;
                            if (content[c].thumb) img = thumb_src + content[c].thumb;
                            if (content[c].title) title = content[c].title;
                            if (content[c].description) desc = content[c].description;

                            layover.find('.content').html(
                                "<img src='" + img + "' />" +
                                "<p><strong>" + title + "</strong><br/><br/>" + desc + "</p>"
                            )
                            return;
                        } else {
                            layover.find('.content').html(
                                "<img src='" + thumb_placeholder + "' />" +
                                "<p><strong>" + title_placeholder + "</strong><br/><br/>" + desc_placeholder + "</p>"
                            )
                        }
                    }
            })
        }).mouseout(function(e){
            this.animate({
                'fill': '#3C6D32'
            }, 300, function(){
                var layover = $('.layover');
                    layover.removeClass('active');
                    if(layover.css('opacity') > 0 || (!layover.hasClass('active')) ) layover.css('opacity', 0);
            })
        })
     }
}

$(document).ready(function(){
    s = Snap("#snapper");
    s.attr('transform', "scale("+ scale +")");

    $.ajax({
        dataType: "json",
        url: "./assets/rsrc/areas.json",
        success: function(data){
            drawMap(data)
        }
    });

    $.ajax({
        dataType: "json",
        url: "./assets/rsrc/content.json",
        success: function(data){
            content = data;
        }
    });

})