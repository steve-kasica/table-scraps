// https://observablehq.com/@datadesk/swana-population-map@267
import define1 from "../@jashkenas/inputs.js";
import define2 from "../@mbostock/saving-svg.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# SWANA population map

This analysis was developed for the March 28, 2019, Los Angeles Times story ["Are Arabs and Iranians white? Census says yes, but many disagree"](https://www.latimes.com/projects/la-me-census-middle-east-north-africa-race/).

It reported that roughly 3 million people of Southwest Asian, Middle Eastern or North African descent live in the United States. No county is home to more of these communities than Los Angeles, where more than 350,000 people can trace their roots to a region that stretches from Mauritania to the mountains of Afghanistan.
`
)});
  main.variable(observer("chart")).define("chart", ["d3","projection","maxRadius","DOM","topojson","us","population"], function(d3,projection,maxRadius,DOM,topojson,us,population)
{
  const width = 960;
  const height = 600;
  var path = d3.geoPath().projection(projection);
  const formatNumber = d3.format(",.0f");
  const radius = d3.scaleSqrt().domain([0, 400000]).range([0, maxRadius]);

  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto");

  svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#E6E6E6")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  const legend = svg.append("g")
      .attr("fill", "#777")
      .attr("transform", `translate(${width - 50},${height - 2})`)
      .attr("text-anchor", "middle")
      .style("font", "10px sans-serif")
    .selectAll("g")
      .data([50000, 200000, 500000])
    .join("g");

  legend.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("cy", d => -radius(d))
      .attr("r", radius);

  legend.append("text")
      .attr("y", d => -2 * radius(d))
      .attr("dy", "1.3em")
      .text(d3.format(".1s"));

  svg.append("g")
      .attr("fill", "#006d8f")
      .attr("fill-opacity", 0.15)
      .attr("stroke", "#006d8f")
      .attr("stroke-width", 1)
    .selectAll("circle")
    .data(topojson.feature(us, us.objects.counties).features
        .map(d => (d.population = population.get(d.id), d))
        .sort((a, b) => b.population - a.population))
    .join("circle")
      .attr("transform", d => `translate(${path.centroid(d.geometry)})`)
      .attr("r", d => radius(d.population))
    .append("title")
      .text(d => formatNumber(d.population));
  
  // svg.append("g")
  //   .selectAll("circle")
  //   .data(selected_cities)
  //   .join("circle")
  //     .attr("transform", d => `translate(${path.centroid(d.geometry)})`)
  //     .attr("fill", "black")
  //     .attr("stroke-width", 0)
  //     .attr("r", 3)
  //     .attr("data-name", d => d.name)
      // .append("text")
      //   .text(d => d.name)
      //   .attr("font", "sans")
      //   .attr("fill", "black")
      //   .attr("dx", "10")
      //   .attr("text-anchor", "left")
  
  return svg.node();
}
);
  main.variable(observer()).define(["DOM","serialize","chart"], function(DOM,serialize,chart){return(
DOM.download(() => serialize(chart), undefined, "Save as SVG")
)});
  main.variable(observer("viewof maxRadius")).define("viewof maxRadius", ["slider"], function(slider){return(
slider({
  min: 10,
  max: 100,
  value: 25,
  step: 1,
  title: "Maximum radius"
})
)});
  main.variable(observer("maxRadius")).define("maxRadius", ["Generators", "viewof maxRadius"], (G, _) => G.input(_));
  main.variable(observer("projection")).define("projection", ["d3","topojson","us"], function(d3,topojson,us){return(
d3.geoAlbersUsa()
  .fitSize([960, 600], topojson.feature(us, us.objects.counties))
)});
  main.variable(observer("population")).define("population", ["csv"], function(csv){return(
new Map((csv.map(d => [d.fips, +d.swana])))
)});
  main.variable(observer("csv")).define("csv", ["d3"], async function(d3){return(
await d3.csv("https://gist.githubusercontent.com/palewire/047b5e4d4db5e8831f7e7725af53744e/raw/ae8f6f84acabe0f6289d8ac135e85d3d5aa7eb69/swana.csv")
)});
  main.variable(observer("selected_cities")).define("selected_cities", ["cities"], function(cities)
{
  return cities.filter(
    d => d.population > 1500000 | d.name == "Detroit"
  )
}
);
  main.variable(observer("cities")).define("cities", ["d3"], async function(d3)
{
  const json = await d3.json("https://gist.githubusercontent.com/Vudude/cee778c78694fe4183aec99693e104b1/raw/6108e7f372813f261c29ae085659ec66118285ac/cities.geo.json")
  return json.features.map(d => ({
    geometry: d.geometry,
    name: d.properties.city,
    population: +d.properties.population
  }))
}
);
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://gist.githubusercontent.com/jake-low/bd39a072eb4c0822d2c32473816e1c11/raw/5a3296a2049d6719d38b66d0b77c9359b81b8c4c/us-10m-unprojected.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child2 = runtime.module(define2);
  main.import("serialize", child2);
  return main;
}
