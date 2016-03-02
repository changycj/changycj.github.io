// DATA
// THIS SHOULD BE A 6x6 MATRIX
/// matrix[i][j] is number of attacks candidate i has on candidate j
var matrix = [
  [0, 0, 0, 0, 0, 0], // DONALD TRUMP 0
  [20, 0, 500, 100, 120, 10], // JEB BUSH 1
  [30, 20, 0, 30, 40, 50], // MARCO RUBIO 2
  [10, 20, 10, 0, 0, 0], // TED CRUZ 3
  [20, 20, 100, 40, 0, 50], // BEN CARSON 4
  [10, 20, 30, 0, 500, 0] // JOHN KASICH 5
];
// TODO: PUT IN REAL DATA

var candidatesList = ["Donald Trump", "Jeb Bush", "Marco Rubio", "Ted Cruz", "Ben Carson", "John Kasich"];
var maxValue = 500;

// SVG DIMENSIONS
var width = 960;
var height = 500;
var radius = Math.min(width, height) * .41;
var avatarRadius = 30;

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

svg.append("svg:defs").append("svg:marker")
  .attr("id", "arrowhead")
  .attr("viewBox", "0 0 4 4")
  .attr("refX", 4)
  .attr("refY", 2)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("d", "M 1.5 0 L 4 2 L 1.5 4 z");

var arrows = svg.append("g").attr("class", "arrows")
  .selectAll("path")
  .data(chord.chords)
  .enter()
  .append("path")
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
    return "M " + x1 + " " + y1 + " L " + (x2 - offsetX) + " " + (y2 - offsetY);
  })
  .attr("marker-end", "url(\#arrowhead)")
  .style("stroke", function(d) { return colors(d.source.index); })
  .style("stroke-width", function(d) { return lineWidth(d.source.value); })
  .style("opacity", 0.5);

// TODO: ADD AVATARS?
svg.append("g").attr("class", "avatars")
  .selectAll("circle")
  .data(chord.groups)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return radius * Math.cos(angle(d.index)); })
  .attr("cy", function(d) { return radius * Math.sin(angle(d.index)); })
  .attr("r", avatarRadius)
  .style("fill", function(d) { return colors(d.index); })
  .on("mouseover", fade(0))
  .on("mouseout", fade(0.5));


// fade all lines except for self
function fade(opacity, source) {
  return function(g, i) {
    svg.selectAll(".arrows line")
        .filter(function(d) {
          return d.source.index != i;
        })
        .transition()
        .style("opacity", opacity);
  };
}