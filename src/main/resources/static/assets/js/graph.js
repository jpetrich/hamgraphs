function Graph(width,height) {
  this.width = width;
  this.height = height;
  this.currentCenter = { x: width/2 - 4501, y: height/2 - 4501};
  this.currentScale = 1;
  //this.force = d3.layout.force().charge(-200).size([width, height]);

  this.svg = d3.select("#graph")
               .append("svg")
               .attr("id","graph-svg")
               .attr("width", "9002px").attr("height", "9002px")
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
  else {
    this.resetPosition();
    return;
  }
  this.currentCenter.x = x;
  this.currentCenter.y = y;
  this.updatePosition();
}

// move the graph view
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
  this.currentCenter.x = this.width/2 - 4501;
  this.currentCenter.y = this.height/2 - 4501;
  this.currentScale = 1;
  this.updatePosition();
}

Graph.prototype.updatePosition = function() {
  var x = this.currentCenter.x;
  var y = this.currentCenter.y;
  var s = this.currentScale;
  this.svg.attr('style','transform-origin: center; transform:translateX('+x+'px) translateY('+y+'px) scale('+s+');');
}

Graph.prototype.render = function() {
  var self = this;
  if(this.renderInProgress) {
    return;
  }
  this.renderInProgress = true;
  this.updatePosition();
  var svg = this.svg;
  var graph = this.data;
  var linkDistance = this.linkDistance || graph.nodes.reduce(function(acc,node) {
    return Math.max(acc,node.title.length*20);
  }, 120);
  this.linkDistance = linkDistance;
  var maxRadius = linkDistance*7/20;
  var simulation = this.simulation || d3.forceSimulation()
                                        .nodes(graph.nodes)
                                        .force('charge',d3.forceManyBody(-200))
                                        .force('collision',d3.forceCollide(function(d) { return  20 + maxRadius + (d.relativeUserCount - 1)*10}))
                                        .force('center',d3.forceCenter(4501,4501))
                                        .force('links',d3.forceLink(graph.links).distance(linkDistance));

  if(!this.simulation) {
    this.simulation = simulation;
  }
  if(this.simulation.alpha() < 1) {
    this.simulation.alpha(1);
    this.simulation.restart();
  }

  var link = svg.selectAll(".link")
                .data(graph.links).enter()
                .append("line").attr("class", "link");

  var node = svg.selectAll(".node")
                .data(graph.nodes).enter()
                .append("circle")
                .attr("class", function (d) { return "node "+d.label })
                .attr("id", function (d) { return 'hamgraph_'+d.title.replace(/ /g,'_') })
                .attr("data-text", function (d) { return d.title })
                //.attr("r", function(d) { return (d.title.length < 6) ? d.title.length * 10 : d.title.length*7 });
                .attr("r", function(d) { return maxRadius + (d.relativeUserCount - 1)*10});

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

  simulation.on('end',function() {
    self.renderInProgress = false;
  });

}

Graph.prototype.load = function() {
  var self = this;
  var loadedPromise = new Promise(function(resolve,reject) {
    d3.json("/graph", function(error, graph) {
      self.data = graph;
      if (error) {
        return reject(error);
      }
      self.render();
      resolve();
    });
  });
  return loadedPromise;
}
