function makeGraph() {
    d3.json("/lectures.json", function(data) {
        var diameter = 960,
        format = d3.format(",d"),// Sometime there are weird JS/D3 things you have to look up.
        color = d3.scale.category20();

        var bubble = d3.layout.pack()
            .sort(function(a, b){
                if (a.staff == b.staff) {  // saying a string is equal to a string makes sense, but...
                    return 0;
                } else if (a.staff > b.staff){ // this is silly! But it works, so whatevs.
                    return 1;
                } else {
                    return -1;
                }
            })
            .size([diameter, diameter])
            .padding(1.5);

                var svg = d3.select("#chart").append("svg") // HERE -- changed the select to MY thing from body
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr("class", "bubble");

                var node = svg.selectAll(".node")
                    .data(bubble.nodes(scrub(data)).filter(function(d) { return !d.children; }))// HERE -- data was changed to match up with my param name.
                    .enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {  return "translate(" + d.x + "," + d.y + ")"; });

                node.append("title")
                    .text(function(d) { return d.staff + ": " + format(d.value); });

                node.append("circle")
                    .attr('id', function(d){ return "circle"+d.value; })
                    .attr("r", function(d) { return d.r; })
                    .style("fill", function(d) {
                        return color(d.staff);
                    });

                // For each node, include an invisible rectangle for text-wrapping boundaries.
                node.append("rect")
                    .attr('id', function(d){ return "rect"+d.value; })
                    .attr("width", function(d) { return (d.r * 2);})
                    .style("opacity", '0')
                    .attr("height", function(d) { return (d.r * 2);})
                    .attr("transform", function(d) { return "translate(" + (d.x+30) + "," + (d.y+70) + ")"; });

                node.append("text")
                    .attr('id', function(d){ return "text"+d.value; })
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function(d) {
                         return d.title.substring(0, d.r / 3);
                        // return d.value;

                    });


        function makeLegend(nodes){
            var legendRectSize = 18;
            var legendSpacing = 4;
            var legendPlace = d3.select("#legend").append('svg')
                                    .attr("width", 960)
                    .attr("height", 500);

            var legend = legendPlace.selectAll('.legend')
                  .data(color.domain())
                  .enter()
                  .append('g')
                  .attr('class', 'legend')
                  //.attr('y', function(d, i){ debugger;return ((i+1) * 20); });
                .attr('transform', function(d, i) {
                    var horz = 200;
                    var vert = i * 30;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                  .attr('width', legendRectSize)
                  .attr('height', legendRectSize)
                  .attr('x', function(d){ return (d.x); })

                  .attr('y', function(d){ return (d.y); })
                  .style('fill', function(d){ return color(d); })
                  .style('stroke', color);

            legend.append('text')
                  .text(function(d) { return d; })
                    .attr('x', legendRectSize + legendSpacing)
                    .attr('y', legendRectSize - legendSpacing);
        }

        makeLegend(node);

        node[0].forEach(function(n){
            var nodeId = n.__data__.id;
            var bounds = d3.select('#rect'+nodeId);
            d3.select('#text'+ nodeId).textwrap(bounds);
        });

    });

}

function scrub(root){
    var newData = [];
    if (root.children){
        root.children.forEach(function(child) {
            child.value = child.id;
            newData.push(child);
        });
    }
    return {children: newData};
}

makeGraph();