(function($) {

console.log('theme.js loaded.')

    // EVENT HANDLERS

    $(document).on('click', 'img', function(e){
        url = $(this).attr('href')

        if(!url) return;
        window.location.href = url;
    });

    // $('body').on('mouseover', function(e){
    //     if( $(e.target).closest('.snap').length === 0) {
    //         deactivateLayover();
    //     }
    // });

    // -- END EVENT HANDLERS

    // init vars
    var s; var content; var regions;
    
    function drawMap(paths) {
        for(var p in paths) {
            s.path(paths[p]).attr({
                'data-area': p
            }).mouseover(function(e) {
                region = this.attr('region');
                province = this.attr('data-area');
                bindRegion(region);
                showContentBox(this, region, province);
            });
        }
    }
    
    function mapZoom(el) {
        if(scale <= 2 && scale >= .5) {
            if( $(el).hasClass('zoom-in') ) {
                if(scale <= .9) {
                    scale = (scale * 10) + 5;
                    scale = Math.round(scale);
                    scale = scale * .1;
                }
            } else {
                if(scale > .5) {
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
        
        deactivateLayover();

        if(active.attr('region') == region) {
            
            exclusions = ["NCR"];
            if( exclusions.indexOf(region) >= 0 ) { console.log(active.attr('region')); return; }
            
            var snapX = parseInt($('.snap-container').attr('data-x')) || 0;
            var snapY = parseInt($('.snap-container').attr('data-y')) || 0;
            var point = active.getBBox();  
            var left = ($('#snapper').hasClass('zoomed'))? (point.x2 + 180 + (snapX)) * scale : (point.x2 + 360 + (snapX * 2)) * scale;
            var top = ($('#snapper').hasClass('zoomed'))? (point.y + (snapY)) * scale : (point.y + (snapY * 2)) * scale;
            
            layover.css({
                left: left,
                top: top
            })
    
            layover.addClass('active');

            if( $('#snapper').hasClass('zoomed') ) {
                for(var n in names) {
                    if( n == province ) {
                        layover.find('img').removeClass('active');
                        layover.find("." + n).addClass('active');
                        return;
                    } else {
                        layover.find('img').removeClass('active');
                        layover.find(".default").addClass('active');
                    }
                }
            } else {
                for(var r in regions) {
                    if( regions[r].name == region ) {
                        layover.find('img').removeClass('active');
                        layover.find("." + regions[r].content.thumb).addClass('active');
                        return;
                    } else {
                        layover.find('img').removeClass('active');
                        layover.find(".default").addClass('active');
                    }
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
        s.attr('transform', "scale("+ scale +")");
    }
    
    function modifySnap(names) {
    
        layover = $('.layover');
    
        // Append images
        for(var n in names) {
            layover.find('.content').append(
                "<img class='" + n + "'" + "src='" + thumb_src + "provinces/" + n + ".png" + "' />"
            )
        }
        for( var r in regions ) {
            layover.find('.content').append(
                "<img href='" + regions[r].content.url + "' class='" + regions[r].content.thumb + "'" + "src='" + thumb_src + "regions/" + regions[r].content.thumb + ".png" + "' />"
            )
        }

        // set path attributes
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
        interact('.snap-container')
            .draggable({
                inertia: true,
                restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 1, left: 1, bottom: 0, right: 0 }
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

                deactivateLayover();

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
        //  url: "https://silippinas.com/wp-content/uploads/assets/rsrc/areas.json",
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
        //  url: "https://silippinas.com/wp-content/uploads/assets/rsrc/content.json",
            url: "./assets/rsrc/content.json",
            success: function(data){
                regions = data.regions;
                names = data.names;
                modifySnap(names);
            }
        });
    }

    function deactivateLayover(){
        $('.layover').removeClass('active');
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

})( jQuery );

// 12/18 - 1200 - 