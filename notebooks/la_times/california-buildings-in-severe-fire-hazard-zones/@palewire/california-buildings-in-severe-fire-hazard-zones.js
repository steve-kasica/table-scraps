// https://observablehq.com/@palewire/california-buildings-in-severe-fire-hazard-zones@734
import define1 from "../@mbostock/saving-svg.js";
import define2 from "../@jashkenas/inputs.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# California buildings in severe fire hazard zones

The Los Angeles Times conducted an analysis of California buildings within fire hazard zones for the Dec. 18, 2018, story ["A million California buildings face wildfire risk. ‘Extraordinary steps’ are needed to protect them."](https://www.latimes.com/projects/la-me-california-buildings-in-fire-zones/) It found that at least 1.1 million structures, roughly 1 in 10 in the state, are within the highest risk zones.

Here's one of several maps presented as part of the story.
`
)});
  main.variable(observer("viewof hexSize")).define("viewof hexSize", ["select"], function(select){return(
select({
  title: "Pick a hexagon size",
  options: ["Big", "Small"],
  value: "Big"
})
)});
  main.variable(observer("hexSize")).define("hexSize", ["Generators", "viewof hexSize"], (G, _) => G.input(_));
  main.variable(observer("viewof metric")).define("viewof metric", ["select"], function(select){return(
select({
  title: "Pick a metric",
  options: [
    {label: "# buildings in a risk zone", value: "in_zone"},
    {label: "% buildings in a risk zone", value: "in_pct"},
    {label: "Total buildings", value: "total"},
  ],
  value: "# buildings in a risk zone"
})
)});
  main.variable(observer("metric")).define("metric", ["Generators", "viewof metric"], (G, _) => G.input(_));
  main.variable(observer("legend")).define("legend", ["svg","width","minimum","legendScale","legendBreaks","formatTick","color"], function(svg,width,minimum,legendScale,legendBreaks,formatTick,color){return(
svg`<svg viewBox="0 0 ${width} 50" style="width:100%;height:auto;">
<g class="legend">
    <text y="26" dy="0.71em">${minimum}</text>
    <text y="26" dy="0.71em" x="${legendScale(legendBreaks[4][0])}">
      ${formatTick(legendBreaks[4][0])}
    </text>
    <text y="26" dy="0.71em" x="${legendScale(legendBreaks[6][0])}">
      ${formatTick(legendBreaks[6][0])}
    </text>
    <text y="26" dy="0.71em" x="${legendScale(legendBreaks[7][0])}">
      ${formatTick(legendBreaks[7][0])}
    </text>
    <text y="26" dy="0.71em" x="${legendScale(legendBreaks[8][0])}">
      ${formatTick(legendBreaks[8][0])}
    </text>
    ${legendBreaks.map(d => svg`
      <rect class="tick"
            height=20
            x=${legendScale(d[0])}
            width=${legendScale(d[1]) - legendScale(d[0])}
            fill="${color(d[0])}">
      </rect>
    `)}
</g>`
)});
  main.variable(observer("map")).define("map", ["svg","width","height","path","state","hexes","color","metric","cities","projection"], function(svg,width,height,path,state,hexes,color,metric,cities,projection){return(
svg`<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;">
<defs>
  <filter id="drop-shadow" height="130%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"> </feGaussianBlur>
    <feOffset in="blur" dx="0" dy="2" result="offsetBlur"></feOffset>
    <feMerge>
      <feMergeNode in="offsetBlur"></feMergeNode>
      <feMergeNode in="SourceGraphic"></feMergeNode>
    </feMerge>
  </filter>
</defs>
<g class="state drop-shadow">
  ${svg`<path d="${path(state)}"></path>`}
</g>
<g class="hexes">
${hexes.features.map(d => svg`
  <path class="hex"
    fill="${color(d.properties[metric])}"
    d="${path(d)}">
  </path>
`)}
</g>
${cities.map(d => svg`
  <g class="city"
     data-name="${d.name}"
     transform="translate(${projection(d.coordinates)[0]}, ${projection(d.coordinates)[1]})">
    <circle r="5" cy="0" cx="0"></circle>
    <text x="${d.x || 9}" y="${d.y || 5}" text-anchor="${d.anchor || 'start'}">
      ${d.name}
    </text>
  </g>
`)}
</svg>`
)});
  main.variable(observer("css")).define("css", ["html"], function(html){return(
html`<style>
text {
  font-family: sans-serif;
  font-weight: bold;
  font-size: 15px;
  text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.8), 
               -2px -2px 0px rgba(255, 255, 255, 0.8),
               -2px 2px 0px rgba(255, 255, 255, 0.8),
               2px -2px 0px rgba(255, 255, 255, 0.8);
}
.legend text {
  font-size: 13px;
  text-anchor: start;
}
.state path {
  stroke: #333333;
  stroke-width: 0.6;
  fill: #f9f9f9;
}
.hexes .hex {
    stroke-width=0.1
    stroke="white"
    fill-opacity="0.85"
}
.city circle {
  fill: none;
  stroke: #000000;
}
.drop-shadow {
    fill: #ddd;
    stroke: #fff;
    stroke-width: .5px;
    filter: url(#drop-shadow);
}
</style>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### SVG exports`
)});
  main.variable(observer()).define(["DOM","serialize","map","hexSize"], function(DOM,serialize,map,hexSize){return(
DOM.download(serialize(map), hexSize.toLowerCase() + "-map.svg", "Download map")
)});
  main.variable(observer()).define(["DOM","serialize","legend","hexSize"], function(DOM,serialize,legend,hexSize){return(
DOM.download(serialize(legend), hexSize.toLowerCase() + "-legend.svg", "Download legend")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Configuration`
)});
  main.variable(observer("formatTick")).define("formatTick", ["metric","percent","intcomma","roundHundred"], function(metric,percent,intcomma,roundHundred){return(
v =>  metric == 'in_pct' ? percent(v) : intcomma(roundHundred(v))
)});
  main.variable(observer("percent")).define("percent", function(){return(
v => (v*100).toFixed(1) + "%"
)});
  main.variable(observer("intcomma")).define("intcomma", ["d3"], function(d3){return(
d3.format(",")
)});
  main.variable(observer("roundHundred")).define("roundHundred", function(){return(
v => Math.round(v/100)*100
)});
  main.variable(observer("legendBreaks")).define("legendBreaks", ["color"], function(color){return(
color.range().map(c => {
    var d = color.invertExtent(c);
    if (d[0] == null) d[0] = 1;
    return d;
})
)});
  main.variable(observer("legendAxis")).define("legendAxis", ["d3","legendScale","color","breaks"], function(d3,legendScale,color,breaks){return(
d3.axisBottom(legendScale)
    .tickSize(13)
    .tickValues(color.domain())
    .ticks(breaks)
)});
  main.variable(observer("legendScale")).define("legendScale", ["d3","hexes","metric","width"], function(d3,hexes,metric,width){return(
d3.scaleLinear()
    .domain(d3.extent(hexes.features.map(d => d.properties[metric])))
    .range([0, width*0.66])
)});
  main.variable(observer("color")).define("color", ["d3","ckMeansGroups","breaks"], function(d3,ckMeansGroups,breaks){return(
d3.scaleThreshold()
  .domain(ckMeansGroups.map(d => d3.min(d)))
  .range(d3.schemeReds[breaks])
)});
  main.variable(observer("ckMeansGroups")).define("ckMeansGroups", ["ss","hexes","metric","breaks"], function(ss,hexes,metric,breaks){return(
ss.ckmeans(hexes.features.map(d => d.properties[metric]), breaks)
)});
  main.variable(observer("breaks")).define("breaks", function(){return(
9
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath().projection(projection)
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height"], function(d3,width,height){return(
d3.geoMercator()
  .center([-118.75, 37.5])
  .scale((1 << 19) / (40 * Math.PI))
  .translate([width / 2, height / 2])
)});
  main.variable(observer("height")).define("height", function(){return(
900
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Data`
)});
  main.variable(observer("cities")).define("cities", function(){return(
[
  {
    name: 'Los Angeles',
    coordinates: [-118.2437, 33.95],
  },
  {
    name: "Paradise",
    coordinates: [-121.60, 39.7596]
  },
  {
    name: "Oakland",
    coordinates: [-122.21, 37.81]
  },
  {
    name: "Redding",
    coordinates: [-122.3917, 40.5865]
  },
  {
    name: "Sacramento",
    coordinates: [-121.4944, 38.5816]
  },
  {
    name: "Malibu",
    coordinates: [-118.7798, 34.05],
    x: "-9",
    anchor: "end"
  },
  {
    name: "San Diego",
    coordinates: [-117.1611, 32.7157],
    x: "-9",
    anchor: "end"
  },
  {
    name: "Fresno",
    coordinates: [-119.7871, 36.7378]
  }
]
)});
  main.variable(observer("state")).define("state", ["d3","topojson"], async function(d3,topojson)
{
  const url = "https://gist.githubusercontent.com/palewire/e001c971f2cab1664168658caa7536da/raw/state.json";
  const r = await d3.json(url);
  return topojson.feature(r, r.objects["state"]).features[0];
}
);
  main.variable(observer("hexes")).define("hexes", ["d3","hexConfig","topojson","metric","minimum"], async function(d3,hexConfig,topojson,metric,minimum)
{
  const r = await d3.json(hexConfig.url);
  const layer = topojson.feature(r, r.objects[hexConfig.name]);
  return {
    type: "FeatureCollection",
    features: layer.features.filter(d => d.properties[metric] >= minimum)
  };
}
);
  main.variable(observer("hexConfig")).define("hexConfig", ["hexSize"], function(hexSize)
{
  return {
    Big: {
      name: "big-hexes-with-analysis",
      url: "https://gist.githubusercontent.com/palewire/a57662d364a131bc4d17ca436cc4e20b/raw/big-hexes-with-analysis.json"
    },
    Small: {
      name: "small-hexes-with-analysis",
      url: "https://gist.githubusercontent.com/palewire/37354699bc3855ccf5e1b48eff6fc146/raw/small-hexes-with-analysis.json"
    }
  }[hexSize];
}
);
  main.variable(observer("minimum")).define("minimum", ["metric"], function(metric)
{
  return {
    in_zone: 10,
    in_pct: 0.01,
    total: 1
  }[metric]
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`### Dependencies`
)});
  main.variable(observer("ss")).define("ss", ["require"], function(require){return(
require("simple-statistics")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("serialize", child1);
  const child2 = runtime.module(define2);
  main.import("select", child2);
  main.import("slider", child2);
  return main;
}
