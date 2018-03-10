function Graph(width,height) {
  this.width = width;
  this.height = height;
  this.currentCenter = { x: 0, y: 0};
  this.currentScale = 1;
  //this.force = d3.layout.force().charge(-200).size([width, height]);
  this.simulation = d3.forceSimulation()
                      .stop()
                      .force('charge',d3.forceManyBody(-200))
                      .force('center',d3.forceCenter((this.width/2),(this.height/2)));

  this.svg = d3.select("#graph")
               .append("svg")
               .attr("id","graph-svg")
               .attr("width", "100%").attr("height", "100%")
               .attr("pointer-events", "all");
}

// center on relative coordinates to graph center
Graph.prototype.centerOnNode = function(node) {
  if(this.simulation.alpha() > 0.2) {
    console.log('alpha too high',this.simulation.alpha());
    return;
  }
  var x = 0, y = 0;
  if(node) {
    var gcx = this.width/2;
    var gcy = this.height/2;
    var nx = Math.round(Number(node.x));
    var ny = Math.round(Number(node.y));
    x = gcx - nx;
    y = gcy - ny;
  }
  this.currentCenter.x = x;
  this.currentCenter.y = y;
  this.updatePosition();
}

Graph.prototype.move = function(axis,direction) {
  if(axis !== 'x' && axis !== 'y') {
    return;
  }
  direction = direction < 0 ? -1 : 1;
  this.currentCenter[axis] += direction * (1/this.currentScale) * 50;
  this.updatePosition();
}

Graph.prototype.zoom = function(direction) {
  this.currentScale += (direction < 0 ? -0.1 : 0.1);
  this.updatePosition();
}

Graph.prototype.resetPosition = function() {
  this.currentCenter.x = 0;
  this.currentCenter.y = 0;
  this.currentScale = 1;
  this.updatePosition();
}

Graph.prototype.updatePosition = function() {
  var x = this.currentCenter.x;
  var y = this.currentCenter.y;
  var s = this.currentScale;
  this.svg.attr('style','transform:translateX('+x+'px) translateY('+y+'px) scale('+s+');');
}

Graph.prototype.load = function() {
  var self = this;
  var svg = this.svg;
  var simulation = this.simulation;
  var loadedPromise = new Promise(function(resolve,reject) {
    d3.json("/graph", function(error, graph) {
      if (error) {
        return reject(error);
      }

      var linkDistance = graph.nodes.reduce(function(acc,node) {
        return Math.max(acc,node.title.length*20);
      }, 120);

      //force.linkDistance(linkDistance);
      simulation.nodes(graph.nodes);
      simulation.force('links',d3.forceLink(graph.links).distance(linkDistance));
      simulation.restart();
      //force.nodes(graph.nodes).links(graph.links).start();

      var link = svg.selectAll(".link")
                    .data(graph.links).enter()
                    .append("line").attr("class", "link");

      var node = svg.selectAll(".node")
                    .data(graph.nodes).enter()
                    .append("circle")
                    .attr("class", function (d) { return "node "+d.label })
                    .attr("id", function (d) { return 'hamgraph_'+d.title.replace(/ /g,'_') })
                    .attr("data-text", function (d) { return d.title })
                    .attr("r", function(d) { return d.title.length*7 });
                    //.call(force.drag);

      node.on('click',function(e) {
        self.centerOnNode(e);
        $('#interface').trigger('selectActivityFromNodeClick',e);
      });

      var label = svg.selectAll('.graph-label')
                    .data(graph.nodes).enter()
                    .append('text')
                    .attr('class','graph-label')
                    .text(function(d){return d.title});
      
      label.on('click',function(e) {
        self.centerOnNode(e);
        $('#interface').trigger('selectActivityFromNodeClick',e);
      });

      // force feed algo ticks
      simulation.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        label.attr('x',function(n) { return n.x - (n.title.length * 5); })
            .attr('y',function(n) { return n.y + 4; });
      });

      simulation.on('end',resolve);
    });
  });
  return loadedPromise;
}
