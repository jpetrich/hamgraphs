function loadGraph(width,height) {

//var width = 800, height = 800;

var force = d3.layout.force()
        .charge(-200).size([width, height]);

var svg = d3.select("#graph").append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("pointer-events", "all");

d3.json("/graph", function(error, graph) {
  if (error) return;

  var linkDistance = graph.nodes.reduce(function(acc,node) {
    return Math.max(acc,node.title.length*20);
  }, 120);

  force.linkDistance(linkDistance);

  force.nodes(graph.nodes).links(graph.links).start();

  var link = svg.selectAll(".link")
                .data(graph.links).enter()
                .append("line").attr("class", "link");

  var node = svg.selectAll(".node")
                .data(graph.nodes).enter()
                .append("circle")
                .attr("class", function (d) { return "node "+d.label })
                .attr("r", function(d) { return d.title.length*8 })
                .call(force.drag);

  var label = svg.selectAll('.graph-label')
                 .data(graph.nodes).enter()
                 .append('text')
                 .attr('class','graph-label')
                 .text(function(d){return d.title});

  // force feed algo ticks
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    label.attr('x',function(n) { return n.x - (n.title.length * 5); })
         .attr('y',function(n) { return n.y + 4; });
  });
});

}
