// https://observablehq.com/@d3/contours@247
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Contours

Showing the [Goldstein–Price test function](https://en.wikipedia.org/wiki/Test_functions_for_optimization).`
)});
  main.variable(observer("value")).define("value", function(){return(
(x, y) =>
  (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2))
  * (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2))
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","contours","color","xAxis","yAxis"], function(d3,width,height,contours,color,xAxis,yAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width + 28, height])
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("width", "calc(100% + 28px)");

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(contours)
    .join("path")
      .attr("fill", d => color(d.value))
      .attr("d", d3.geoPath());

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}
);
  main.variable(observer("color")).define("color", ["d3","thresholds"], function(d3,thresholds){return(
d3.scaleLog()
    .domain(d3.extent(thresholds))
    .interpolate(d => d3.interpolateMagma)
)});
  main.variable(observer("thresholds")).define("thresholds", ["d3"], function(d3){return(
d3.range(1, 20).map(i => Math.pow(2, i))
)});
  main.variable(observer("grid")).define("grid", ["width","height","value","x","y"], function(width,height,value,x,y)
{
  const q = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
  const x0 = -q / 2, x1 = width + 28 + q;
  const y0 = -q / 2, y1 = height + q;
  const n = Math.ceil((x1 - x0) / q);
  const m = Math.ceil((y1 - y0) / q);
  const grid = new Array(n * m);
  for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
      grid[j * n + i] = value(x.invert(i * q + x0), y.invert(j * q + y0));
    }
  }
  grid.x = -q;
  grid.y = -q;
  grid.k = q;
  grid.n = n;
  grid.m = m;
  return grid;
}
);
  main.variable(observer("transform")).define("transform", ["grid"], function(grid){return(
({type, value, coordinates}) => {
  return {type, value, coordinates: coordinates.map(rings => {
    return rings.map(points => {
      return points.map(([x, y]) => ([
        grid.x + grid.k * x,
        grid.y + grid.k * y
      ]));
    });
  })};
}
)});
  main.variable(observer("contours")).define("contours", ["d3","grid","thresholds","transform"], function(d3,grid,thresholds,transform){return(
d3.contours()
    .size([grid.n, grid.m])
    .thresholds(thresholds)
  (grid)
    .map(transform)
)});
  main.variable(observer("x")).define("x", ["d3","width"], function(d3,width){return(
d3.scaleLinear([-2, 2], [0, width + 28])
)});
  main.variable(observer("y")).define("y", ["d3","height"], function(d3,height){return(
d3.scaleLinear([-2, 1], [height, 0])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","d3","x","width"], function(height,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(width / height * 10))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => x.domain().includes(d)).remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["d3","y"], function(d3,y){return(
g => g
    .attr("transform", "translate(-1,0)")
    .call(d3.axisRight(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => y.domain().includes(d)).remove())
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
