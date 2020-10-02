function init() {
    d3.dsv(",", "board_games.csv", function(d) {
      return {
        source: d.source,
        target: d.target,
        value: +d.value
      }
    }).then(function(data) {

      var links = data;

      var nodes = {};


      // compute the distinct nodes from the links.
      links.forEach(function(link) {
          link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
          link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
      });
        var temp = findMaxMin();
        var min = temp[0], max = temp[1];

      var width = 1200,
          height = 700;

      var force = d3.forceSimulation()
          .nodes(d3.values(nodes))
          .force("link", d3.forceLink(links).distance(100))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force("x", d3.forceX())
          .force("y", d3.forceY())
          .force("charge", d3.forceManyBody().strength(-250))
          .alphaTarget(1)
          .on("tick", tick);

      var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);

      // add the links
      var path = svg.append("g")
          .selectAll("path")
          .data(links)
          .enter()
          .append("path")
          .attr("class", function(d) { return "lk-" + d.value; });


      // define the nodes
      var node = svg.selectAll(".node")
          .data(force.nodes())
          .enter().append("g")
          .attr("class", "node")
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

      // add the nodes
      node.append("circle")
          .attr("r", function(d){
              var count = findDegree(d);
              return count * 2;
          })
          .style("fill", function(d){
              return getColor(findDegree(d));
          }).on("dblclick", function(d){
             d3.select(this).classed("fixed", d.fixed = false);
             d3.select(this).style("stroke", "");
             d3.select(this.parentNode).selectAll("text").style("stroke", "");
             d.fx=null;
             d.fy=null;
          });

      node.append("text")
          .text(function(d){
              return d.name
          }).attr("dx", function(d){
            return findDegree(d) + 5;
          }).attr("dy", function (d) {
            return - findDegree(d) -5;
          });

      // add the curvy lines
      function tick() {
          path.attr("d", function(d) {
              var dx = d.target.x - d.source.x,
                  dy = d.target.y - d.source.y,
                  dr = Math.sqrt(dx * dx + dy * dy);
              return "M" +
                  d.source.x + "," +
                  d.source.y + "A" +
                  dr + "," + dr + " 0 0,1 " +
                  d.target.x + "," +
                  d.target.y;
          });

          node.attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
          });
      };

      function dragstarted(d) {
          if (!d3.event.active) force.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      };

      function dragged(d) {
          d3.select(this).selectAll("circle").style("stroke", "yellow");
          d3.select(this).selectAll("text").style("stroke", "red");
          d.fx = d3.event.x;
          d.fy = d3.event.y;
      };

      function dragended(d) {
          d3.select(this).classed("fixed", d.fixed=true);
          if (!d3.event.active) force.alphaTarget(0);
      }

      function getColor(degree) {
        degree = degree/(max);
        var components = [Math.round(255 * (1-degree) +  128* (degree)),
            Math.round(251 * (1-degree) + 0 * (degree)),
            Math.round(255 * (1-degree) + 204 * (degree))];
        var rgb = "#";
        for(var i in components){
            var hex = components[i].toString(16);
            rgb += hex.length == 1? "0"+hex: hex;
        }
        return rgb
      }

      function findDegree(d) {
        var count = 0;
        for(var i=0; i<links.length; i++){
          if(links[i].source.name == d.name || links[i].target.name == d.name){
              count++;
          }
        }
        return count;
      }

      function findMaxMin(){
          var min = Number.POSITIVE_INFINITY;
          var max = Number.NEGATIVE_INFINITY;

          for(var i in nodes){
              var degree = findDegree(nodes[i]);
              if(degree < min)
                  min = degree;
              if(degree > max)
                  max = degree;
          }
          return [min, max];
      }

      svg.append("text")
        .attr("x", width - 250)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("psrinivasan48");
    }).catch(function(error) {
      console.log(error);
    });
}