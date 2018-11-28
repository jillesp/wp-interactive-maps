console.log('theme.js loaded.')

// init vars

var s; var content; var regions;

function drawMap(paths) {
    for(var p in paths) {
        s.path(paths[p]).attr({
            'data-area': p
        }).mouseover(function(e) {
            region = (this.attr('region'));
            
            bindRegion(region);
            showContentBox(this, region);

        });
     }
}

function mapZoom(el) {
    if(scale <= 2 && scale >= 0) {
        if( $(el).hasClass('zoom-in') ) {
            if(scale < 2) {
                scale = (scale * 10) + 5;
                scale = Math.round(scale);
                scale = scale * .1;
            }
        } else {
            if(scale > .1) {
                scale = (scale * 10) - 5;
                scale = Math.round(scale);
                scale = scale * .1;
            }
        }
    }
    updateMapScale(scale);
}

function bindRegion(region) {
    paths = s.selectAll('path');
    paths.forEach( function( path ) {
        if(path.attr('region') == region) {
            path.animate({
                fill: path.attr('hover_fill')
            }, 300);
        } else {
            path.animate({
                fill: path.attr('default_fill')
            }, 300);
        }
    })
}

function showContentBox(active, region) {

    layover = $('.layover');

    s.mouseout(function(){
        layover.removeClass('active');
    })
    
    if(active.attr('region') == region) {
        var point = active.getBBox();
        var left = (point.x + point.width + 20) * scale;
        var top = (point.y) * scale;
        
        layover.css({
            left: left,
            top: top
        })
        layover.addClass('active');
                
        for(var r in regions) {
            if( regions[r].name == region ) {
                var img, title, desc;
                if (regions[r].content.thumb) img = thumb_src + regions[r].content.thumb;
                if (regions[r].content.title) title = regions[r].name;
                if (regions[r].content.description) desc = regions[r].content.description;

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
    }
}

function updateMapScale(scale) {
    if(scale >= 1) {
        $('#snapper').addClass('zoomed');
    } else {
        $('#snapper').removeClass('zoomed');
    }
    // console.log(scale)
    s.attr('transform', "scale("+ scale +")");
}

function modifySnap(names) {
    for( var r in regions ) {
        fill = regions[r].color;
        hover_fill = regions[r].hover;
        region = regions[r].name;
        for(var p in regions[r].provinces) {
            area = regions[r].provinces[p];
            target = $('path[data-area="' + area + '"]');
            target.attr({
                name: names[area],
                region: region,
                fill: fill,
                default_fill: fill,
                hover_fill: hover_fill
            });
            
        }
    }

    exclusions = ["Puerto Princesa", "Dagupan", "Bacolod", "Naga", "Baguio", "Mandaue", "Lapu-Lapu"];
    existing = new Array();

    paths = s.selectAll('path');
    paths.forEach( function( path ) {
        point = path.getBBox();
        x = ((point.x2 - point.x) / 2) + point.x - 10;
        y = ((point.y2 - point.y) / 2) + point.y + 10;
        if(path.attr('name')) {
            name = path.attr('name');
            if (name == 'Mandaluyong City') {
                name = "NCR";
            }
            else if( exclusions.indexOf(name) >= 0 || existing.indexOf(name) >= 0 || path.attr('region') == "NCR") { 
                return; 
            }

            if(name == "Benguet" || name == "Bulacan" || name == "General Santos" ) { y += 8; }
            existing.push(name);
            text = s.text({x: x, y: y, text: name})
        }
    })

    $('#snapper').addClass('active');
    
}

function initInteractJS(){
    interact('.snap')
        .draggable({
            inertia: true,
            restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0.5, left: 0.5, bottom: 0.5, right: 0.5 }
            },
            autoScroll: true,

            onmove: dragMoveListener,
            onend: function (event) {
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                            Math.pow(event.pageY - event.y0, 2) | 0))
                    .toFixed(2) + 'px');
            }
        });

        function dragMoveListener (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

        window.dragMoveListener = dragMoveListener;
}

function initMap() {
    $.ajax({
        dataType: "json",
        // url: "http://silippinas.com/wp-content/uploads/assets/rsrc/areas.json",
        url: "./assets/rsrc/areas.json",
        success: function(data){
            drawMap(data)
            initMapDetails(data);
        }
    });
}

function initMapDetails(paths) {
    $.ajax({
        dataType: "json",
        // url: "http://silippinas.com/wp-content/uploads/assets/rsrc/content.json",
        url: "./assets/rsrc/content.json",
        success: function(data){
            regions = data.regions;
            names = data.names;
            modifySnap(names);
        }
    });
}


$(document).ready(function(){
    s = Snap("#snapper");
    s.attr('transform', "scale("+ scale +")");

    initMap();
    initInteractJS();

    $('.snapper-zoom a').click(function(e){
        e.preventDefault();
        mapZoom(e.currentTarget);
    })

})

