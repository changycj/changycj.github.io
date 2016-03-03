$(document).ready(function() {
  
  // DATA
  // THIS SHOULD BE A 6x6 MATRIX
  /// matrix[i][j] is number of attacks candidate i has on candidate j
  var matrix = [
    [0, 0, 0, 0, 0, 0], // DONALD TRUMP 0
    [9604, 0, 0, 2428127, 404482, 0], // JEB BUSH 1
    [0, 0, 0, 0, 0, 0], // BEN CARSON 2
    [114792.5, 106625, 0, 0, 0, 0], // MARCO RUBIO 3
    [468, 0, 0, 0, 0, 0], // JOHN KASICH 4
    [143688.5, 0, 0, 1238968, 0, 0] // TED CRUZ 5
  ];

  var avatars = [
    "./resources/trump.jpg",
    "./resources/bush.jpg",
    "./resources/carson.jpg",
    "./resources/rubio.jpg",
    "./resources/kasich.jpg",
    "./resources/cruz.jpg"
  ];

  var names = ["Donald Trump", "Jeb Bush", "Ben Carson", "Marco Rubio", "John Kasich", "Ted Cruz"];

  var maxValue = 2428127;
  var minValue = 468;

  // SVG DIMENSIONS
  var width = 960;
  var height = 600;
  var radius = Math.min(width, height) * 0.5;
  var avatarRadius = 30;
  var avatarBorder = 2;

  // CREATE SVG OBJECT
  var svg = d3.select("svg#chord")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // CREATE CHORDS
  var chord = d3.layout.chord()
    .padding(.05)
    .sortSubgroups(d3.descending)
    .matrix(matrix);

  // MAP INDEX TO COLORS
  var colors = d3.scale.category10();

  // MAP VALUE TO WIDTH
  var lineWidth = d3.scale.linear()
    .domain([minValue, maxValue])
    .range([1, 30]);

  // DRAW AVATAR CIRCLES
  var angle = d3.scale.linear()
    .domain([0, avatars.length])
    .range([0, 2 * Math.PI]);

  // APPEND ARROWS
  // TODO: ARROWHEAD

  var arrowGroup = svg
    .selectAll("g.arrows")
    .data(chord.chords)
    .enter()
    .append("g").attr("class", "arrows")

  arrowGroup.append("path")
    .style("stroke-width", function(d) { return lineWidth(d.source.value); })
    .style("stroke", function(d) { return colors(d.source.index); })
    .style("opacity", 0.5)
    .attr("d", function(d) {
      var x1 = radius * Math.cos(angle(d.source.index));
      var y1 = radius * Math.sin(angle(d.source.index));
      var x2 = radius * Math.cos(angle(d.source.subindex));
      var y2 = radius * Math.sin(angle(d.source.subindex));

      var dx = x2 - x1;
      var dy = y2 - y1;
      var len = Math.sqrt(dx * dx + dy * dy);
      var offsetX = dx * avatarRadius / len;
      var offsetY = dy * avatarRadius / len;
      return "M " + x1 + " " + y1 + " L " + (x2 - offsetX ) + " " + (y2 - offsetY);
    })
    .attr("marker-end", function(d) { return getArrowhead(d.source.index); });


  var avatar = svg.append("g").attr("class", "avatars")
    .selectAll("g")
    .data(chord.groups)
    .enter()
    .append("g")
    .on("mouseenter", function(d, i) {
      $("#chord-title").fadeOut(400, function() {
        $("#chord-title").html("Attack Ads from " + names[i]).promise().done(function() {
          $("#chord-title").fadeIn(400);
        });
      });
      fade(0, i);
    })
    .on("mouseleave", function(d, i) {
      $("#chord-title").fadeOut(400, function() {
        $("#chord-title").html("Attack Ads among Candidates").promise().done(function() {
          $("#chord-title").fadeIn(400);
        });
      });      fade(0.5, i); 
    });

  avatar.append("clipPath").attr("id", function(d) { return "clip" + d.index; })
    .append("circle")
    .attr("cx", function(d) { return radius * Math.cos(angle(d.index)); })
    .attr("cy", function(d) { return radius * Math.sin(angle(d.index)); })
    .attr("r", avatarRadius);

  avatar.append("image")
    .attr("xlink:href", function(d) { return avatars[d.index]; })
    .attr("clip-path", function(d) { return "url(#clip" + d.index + ")"; })
    .attr("x", function(d) { return radius * Math.cos(angle(d.index)) - avatarRadius; })
    .attr("y", function(d) { return radius * Math.sin(angle(d.index)) - avatarRadius; })
    .attr("height", 2 * avatarRadius)
    .attr("width", 2 * avatarRadius);

  avatar.append("circle")
    .attr("cx", function(d) { return radius * Math.cos(angle(d.index)); })
    .attr("cy", function(d) { return radius * Math.sin(angle(d.index)); })
    .attr("r", avatarRadius - avatarBorder/2.0)
    .attr("stroke", function(d) { return colors(d.index); })
    .attr("stroke-width", avatarBorder)
    .attr("fill", "none");

  function getArrowhead(i) {
    var marker = svg.append("svg:defs").append("svg:marker")
      .attr("id", "arrowhead" + i)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("refX", 2)
      .attr("refY", 2)
      .attr("orient", "auto");

    marker.append("svg:path")
      .attr("d", "M 2 2 L 1 1 L 1 3 z")
      .style("fill", function(d) { return colors(i); });

    marker.append("svg:path")
      .attr("d", "M 2 2 L 2 3 L 1 3 z")
      .style("fill", "white");
    marker.append("svg:path")
      .attr("d", "M 2 2 L 2 1 L 1 1 z")
      .style("fill", "white");

    return "url(\#arrowhead" + i + ")"
  }

  // fade all lines except for self
  function fade(opacity, i) {
    svg.selectAll(".arrows path")
      .filter(function(d) {
            return d.source.index != i;
      })
      .transition()
      .style("opacity", opacity);
  };

});