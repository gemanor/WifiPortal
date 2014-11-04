'use strict';

/* Directives */


var portalSMBDirectives = angular.module('portalSMB.directives', []);
portalSMBDirectives.directive('ngTopBannerHeight', [function() {
        return {
            link: function($scope, $element, $attr) {
                var isPadding = $attr.ngTopBannerHeight === 'padding' ? true : false;
                var bannerMaxPercent = 3.5,
                        articleHeight = isPadding ? $element[0].clientHeight : angular.element($element[0].nextElementSibling)[0].clientHeight,
                        topTitleHeight = 56;
                var height = (window.innerHeight - topTitleHeight) / 10 * bannerMaxPercent > window.innerHeight - 56 - articleHeight ? window.innerHeight - topTitleHeight - articleHeight : (window.innerHeight - 56) / 10 * bannerMaxPercent;
                if (isPadding) {
                    $element.css({'padding-top': height + 'px'});
                    return;
                }
                $element.css({'height': height + 'px'});
            }
        };
    }]);
portalSMBDirectives.directive('ngPieChart', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    // Browser onresize event
                    $window.onresize = function() {
                        scope.$apply();
                    };


                    // Watch for resize event
                    scope.$watch(function() {
                        scope.render(scope.data);
                    });

                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function(data) {
                        if (!data)
                            return;
                        var h = (angular.element(element[0])[0].clientHeight),
                                w = $window.innerWidth >= h ? h : $window.innerWidth, //width
                                r = (Math.min(w, h) / 2) * 0.95, //radius
                                color = d3.scale.ordinal()
                                .range(['#ff6600', '#ff7519', '#ff8432', '#ff934c', '#ffa366', '#ffb27f', '#ffc199', '#ffd1b2']);     //builtin range of colors
                        angular.element(element).children('*').remove();
                        var vis = d3.select((element[0]))
                                .append("svg:svg")              //create the SVG element inside the <body>
                                .data([data])                   //associate our data with the document
                                .attr("width", w)          //set the width and height of our visualization (these will be attributes of the <svg> tag
                                .attr("align", "center")
                                .attr("height", h)
                                .append("svg:g")                //make a group to hold our pie chart
                                .attr("transform", "translate(" + r + "," + r + ")");    //move the center of the pie chart from 0, 0 to radius, radius

                        var arc = d3.svg.arc().outerRadius(r);

                        var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                                .value(function(d) {
                                    return d.value;
                                });    //we must tell it out to access the value of each element in our data array

                        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                                .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
                                .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                                .attr("class", "slice");    //allow us to style things in the slices (like text)

                        arcs.append("svg:path")
                                .attr("fill", function(d, i) {
                                    return color(i);
                                }) //set the color for each slice to be chosen from the color function defined above
                                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

                        arcs.append("svg:text")                                     //add a label to each slice
                                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                                    //we have to make sure to set these before calling arc.centroid
                                    d.innerRadius = 0;
                                    d.outerRadius = r;
                                    return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                                })
                                .attr("text-anchor", "middle")                          //center the text on it's origin
                                .text(function(d, i) {
                                    return data[i].label;
                                });        //get the label from our original data array
                    };
                });
            }};
    }]);
portalSMBDirectives.directive('ngConnectionsMaps', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    // Browser onresize event
                    $window.onresize = function() {
                        scope.$apply();
                    };

                    scope.$watch('data', function(newVals) {
                        if (newVals !== undefined) {
                            return scope.render(newVals);
                        }
                        return false;
                    });
                    scope.render = function(data) {
                        //remove old trees
                        angular.element(angular.element(element[0]).children()[0]).children().remove();

                        //General Helpers
                        var iconsTranslator = {
                            "internet": "img/internet5.svg",
                            "box": "img/wireless17.svg",
                            "comp": "img/computer73.svg",
                            "phone": "img/phone35.svg",
                            "storage": "img/universal4.svg",
                            "smartPhone": "img/smartphone11.svg"
                        };
                        //get d3 tree object child count
                        var getChildCount = function(root) {
                            var childCount = function(level, n) {
                                if (n.children && n.children.length > 0) {
                                    if (levelWidth.length <= level + 1)
                                        levelWidth.push(0);
                                    levelWidth[level + 1] += n.children.length;
                                    n.children.forEach(function(d) {
                                        childCount(level + 1, d);
                                    });
                                }
                            };
                            var levelWidth = [1];
                            childCount(0, root);
                            return levelWidth;
                        };
                        //d3 diagonal customized
                        var diagonal = d3.svg.diagonal()
                                .source(function(d) {
                                    return {"x": d.source.x, "y": d.source.y + (iconsSize / 2)};
                                })
                                .target(function(d) {
                                    return {"x": d.target.x, "y": d.target.y - (iconsSize / 2)};
                                })
                                .projection(function(d) {
                                    return [d.x, d.y];
                                });

                        var elbow = function(d, i) {
                            var source = d.source;
                            var target = d.target;
                            var hx = (target.x - source.x);
                            var hy = (target.y - source.y) / 2;
                            if (d.isRight)
                                hx = -hx;
                            var retVal = "M" + source.x + "," + (source.y + (iconsSize / 1.5))
                                    + "V" + (target.y - hy)
                                    + "H" + (source.x - hx)
                                    + "V" + (target.y - (iconsSize / 1.5));
                            return retVal;
                        }

                        //article to append tree
                        var svgArticle = angular.element(element[0]).children('article');

                        //Init first dimensions values
                        var margin = {top: 20, right: 20, bottom: 20, left: 20},
                        offsetToTop = 152;
                        var size = {width: $window.innerWidth - margin.left - margin.right,
                            height: $window.innerHeight - offsetToTop - margin.top - margin.bottom};

                        //Init tree object
                        var tree = d3.layout.tree()
                                .size([size['width'], size['height']]);
                        var root = data,
                                nodes = tree.nodes(root),
                                links = tree.links(nodes),
                                iconsMaxLength = getChildCount(root),
                                iconsMaxLength = iconsMaxLength[iconsMaxLength.length - 1],
                                iconsSize = 60;

                        //Reinit dimensions based on children count
                        size['width'] = ((iconsSize + 10) * iconsMaxLength);
                        tree = tree.size([size['width'], size['height']]),
                                nodes = tree.nodes(root),
                                links = tree.links(nodes);
                        margin = {top: (iconsSize / 2) + 10, right: margin['right'], bottom: (iconsSize / 2) + 10, left: margin['left']};

                        var svg = d3.select(svgArticle[0]).append("svg")
                                .attr("width", (size['width'] + margin.left + margin.right))
                                .attr("height", (size['height'] + margin.top + margin.bottom))
                                .attr("align", "center")
                                .append("g")
                                .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

                        var link = svg.selectAll(".link")
                                .data(links)
                                .enter()
                                .append("path")
                                .attr("d", elbow);

                        var node = svg.selectAll(".node")
                                .data(nodes)
                                .enter()
                                .append("g")
                                .attr("class", "node")
                                .attr("transform", function(d) {
                                    return "translate(" + d.x + "," + d.y + ")";
                                });

                        node.append("svg:circle")
                                .attr('cx', 0)
                                .attr('cy', 0)
                                .attr('r', iconsSize/2)
                                .attr('fill', "#ff6600")
                                .on("touchend", function(e) {
                                    scope.$parent.openPopUp(e);
                                });

                        node.append("svg:image")
                                .attr('x', -(iconsSize / 3))
                                .attr('y', -(iconsSize / 3))
                                .attr('width', iconsSize/1.5)
                                .attr('height', iconsSize/1.5)
                                .attr("xlink:href", function(d) {
                                    return iconsTranslator[d.type];
                                })
                                .on("touchend", function(e) {
                                    scope.$parent.openPopUp(e);
                                });

                        setTimeout(function() {
                            element.css('width', size['width'] + margin.left + margin.right + 'px');
                            setTimeout(function() {
                                scope.$parent.setRefresh();
                            }, 1);
                        }, 1);
                    };
                });
            }};
    }]);
