// DATA
// THIS SHOULD BE A 6x6 MATRIX
/// matrix[i][j] is number of attacks candidate i has on candidate j
var matrix = [
  [0, 0, 0, 0, 0, 0], // DONALD TRUMP 0
  [20, 0, 100, 20, 5, 10], // JEB BUSH 1
  [30, 20, 0, 30, 40, 50], // MARCO RUBIO 2
  [10, 20, 10, 0, 0, 0], // TED CRUZ 3
  [20, 20, 100, 40, 0, 50], // BEN CARSON 4
  [10, 20, 30, 0, 100, 0] // JOHN KASICH 5
];

var avatars = [
  "./resources/trump.jpg",
  "./resources/bush.jpg",
  "./resources/rubio.jpg",
  "./resources/cruz.jpg",
  "./resources/carson.jpg",
  "./resources/kasich.jpg"
];
// TODO: PUT IN REAL DATA

var candidatesList = ["Donald Trump", "Jeb Bush", "Marco Rubio", "Ted Cruz", "Ben Carson", "John Kasich"];
var maxValue = 100;

// SVG DIMENSIONS
var width = 960;
var height = 800;
var radius = Math.min(width, height) * 0.5;
var avatarRadius = 30;
var avatarBorder = 2;

// CREATE SVG OBJECT
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// CREATE CHORDS
var chord = d3.layout.chord()
  .padding(.05)
  .sortSubgroups(d3.descending)
  .matrix(matrix);

// MAP INDEX TO CANDIDATES
var candidates = d3.scale.ordinal()
  .domain(d3.range(candidatesList.length))
  .range(candidatesList);

// MAP INDEX TO COLORS
var colors = d3.scale.category10();

// MAP VALUE TO WIDTH
var lineWidth = d3.scale.linear()
  .domain([0, maxValue])
  .range([0, 30]);

// DRAW AVATAR CIRCLES
var angle = d3.scale.linear()
  .domain([0, candidatesList.length])
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
  .on("mouseover", fade(0))
  .on("mouseout", fade(0.5));

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
function fade(opacity) {
  return function(g, i) {
    svg.selectAll(".arrows path")
        .filter(function(d) {
          return d.source.index != i;
        })
        .transition()
        .style("opacity", opacity);
  };
}