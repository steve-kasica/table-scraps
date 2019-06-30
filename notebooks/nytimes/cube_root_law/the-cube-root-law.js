// https://observablehq.com/@sahilchinoy/the-cube-root-law@372
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# The Cube Root Law`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`For a [New York Times editorial](https://www.nytimes.com/interactive/2018/11/09/opinion/expanded-house-representatives-size.html) about expanding the size of the House.

According to [a model](https://escholarship.org/uc/item/45g370k4#main) proposed by political scientist Rein Taagepera in 1972, the size of a country&rsquo;s legislature roughly tracks the cube root of its population. This implies that the size of the House should be (dashed line) about the cube root of the population minus the size of the Senate.

Through the 1800s, this relationship roughly held. But since about 1950, the House has been too small for the country. In 2020, the projected U.S. population implies a House with 593 members.`
)});
  main.variable(observer()).define(["d3","DOM","houseSize","population"], function(d3,DOM,houseSize,population)
{
  const width = 600;
  const height = 400;
  
  const svg = d3.select(DOM.svg(width, height))
  .style('font-family', 'sans-serif')
  .style('font-weight', 300)
  .style('font-size', '12px');
  
  const margin = {
    left: 40,
    right: 35,
    bottom: 30,
    top: 10
  }
  
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const x = d3.scaleLinear()
  .domain(d3.extent(houseSize.map(d => d.year)))
  .range([0, chartWidth]);
  
  const y = d3.scaleLinear()
  .domain([0, 600])
  .range([chartHeight, 0]);
  
  const chart = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const xAxis = g => g
    .attr("transform", `translate(0, ${chartHeight + 4})`)
    .call(d3.axisBottom(x)
          .tickFormat(d => d)
          .ticks(5)
          .tickSize(10)
         )
    .call(g => g.select(".domain").remove());
  
  const yAxis = g => g
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.selectAll(".domain, .tick line").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 0)
        .style("text-anchor", "start")
        .text('House seats'));
  
  chart.append('g')
  .style('font-size', '12px')
  .style('font-weight', 300)
  .call(xAxis);

  chart.append('g')
  .style('font-size', '12px')
  .style('font-weight', 300)
  .call(yAxis);
  
  // gridlines
  
  chart.append('g')			
  .call(d3.axisLeft(y).ticks(5)
    .tickSize(-chartWidth)
    .tickFormat('')
  ).call(g => g.select(".domain").remove())
  .call(g => g.select('.tick:last-of-type line').attr('x1', 80))
  .selectAll('line')
  .style('stroke', (d, i) => i != 0 ? '#ddd' : '#000')
  .style('stroke-opacity', .5);
  
  const repsLine = d3.line()
  .x(d => x(d.year))
  .y(d => y(d.reps))
  .curve(d3.curveStepBefore);
  
  chart.append('path')
  .datum(houseSize)
  .attr('d', repsLine)
  .style('stroke', 'steelblue')
  .style('stroke-width', '2px')
  .style('fill', 'none');
  
  const popLine = d3.line()
  .x(d => x(d.year))
  .y(d => y(d.reps))
  .curve(d3.curveCardinal);
  
  chart.append('path')
  .datum(population)
  .attr('d', popLine)
  .style('stroke', 'black')
  .style('stroke-width', '2px')
  .style('stroke-dasharray', '2px 3px')
  .style('fill', 'none');
  
  const ann1 = chart.append('g')
  .datum(houseSize[houseSize.length - 1])
  .attr('transform', d => `translate(${x(d.year)}, ${y(d.reps)})`)
  
  ann1.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 4)
  .style('fill', 'steelblue');
  
  ann1.append('text')
  .attr('x', 10)
  .attr('y', 4)
  .text(d => d.reps.toFixed(0))
  .style('font-size', '14px')
  .style('font-weight', 600)
  
  const ann2 = chart.append('g')
  .datum(population[population.length - 1])
  .attr('transform', d => `translate(${x(d.year)}, ${y(d.reps)})`)
  
  ann2.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 4)
  .style('fill', '#000');
  
  ann2.append('text')
  .attr('x', 10)
  .attr('y', 4)
  .text(d => d.reps.toFixed(0))
  .style('font-size', '14px')
  .style('font-weight', 600)
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`The U.S. is also an outlier compared to other developed nations, which roughly follow the cube root law.

Here are 37 OECD countries. The dashed line is the cube root of the country's population. Note that we are using the *total size* of Congress (535 seats), because the Senate is a more significant lawmaking body than the smaller chambers of other countries.`
)});
  main.variable(observer("scatter")).define("scatter", ["d3","DOM","oecd"], function(d3,DOM,oecd)
{
  const width = 600;
  const height = 400;
  
  const svg = d3.select(DOM.svg(width, height))
  .style('font-family', 'sans-serif')
  .style('font-weight', 300)
  .style('font-size', '12px');
  
  const margin = {
    left: 40,
    right: 40,
    bottom: 30,
    top: 10
  }
  
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const x = d3.scaleLinear()
  .domain([0, d3.max(oecd.map(d => d.population))])
  .range([0, chartWidth]);
  
  const y = d3.scaleLinear()
  .domain([0, x.domain()[1] ** (1/3)])
  .range([chartHeight, 0]);
  
  const chart = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const xAxis = g => g
    .attr("transform", `translate(0, ${chartHeight + 4})`)
    .call(d3.axisBottom(x)
          .tickFormat(d3.format('.1s'))
          .ticks(5)
          .tickSize(10)
         )
    .call(g => g.selectAll(".domain, .tick line").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 25)
        .style("text-anchor", "start")
        .style('font-weight', 600)
        .text('people'));
  
  const yAxis = g => g
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.selectAll(".domain, .tick line").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 0)
        .style('font-weight', 600)
        .style("text-anchor", "start")
        .text('seats'));
  
  chart.append('g')
  .style('font-size', '12px')
  .style('font-weight', 300)
  .call(xAxis);

  chart.append('g')
  .style('font-size', '12px')
  .style('font-weight', 300)
  .call(yAxis);
  
  // gridlines
  
  chart.append('g')			
  .call(d3.axisLeft(y).ticks(5)
    .tickSize(-chartWidth)
    .tickFormat('')
  ).call(g => g.select(".domain").remove())
  .call(g => g.select('.tick:last-of-type line').attr('x1', 40))
  .selectAll('line')
  .style('stroke', '#ddd')
  .style('stroke-opacity', .5);
  
  chart.append('g')
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(d3.axisBottom(x).ticks(5)
    .tickSize(-chartHeight)
    .tickFormat('')
  ).call(g => g.select(".domain").remove())
  .call(g => g.select('.tick:first-of-type line').attr('y2', -chartHeight + 60))
  .selectAll('line')
  .style('stroke', '#ddd')
  .style('stroke-opacity', .5);
  
  const line = d3.line()
  .x(d => x(d))
  .y(d => y(d ** (1/3)))
  .curve(d3.curveCardinal)
  
  const lineData = d3.range(...x.domain(), 1e6);
  
  chart.append('path')
  .datum(lineData)
  .attr('d', line)
  .style('stroke', '#000')
  .style('stroke-width', '2px')
  .style('stroke-dasharray', '2px 3px')
  .style('fill', 'none')
  
  oecd.find(d => d.country == 'United States').seats = 535;
  
  const countries = chart.append('g')
  .selectAll('g')
  .data(oecd)
  .enter().append('g')
  .attr('transform', d => `translate(${x(d.population)}, ${y(d.seats)})`);
  
  const labels = [
    'United States',
    'Mexico',
    'Poland',
    'United Kingdom',
    'Canada',
    'Colombia',
    'Portugal',
    'Turkey',
  ]
  
  countries.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 4)
  .style('fill', d => d.country == 'United States' ? 'gold' : '#ccc')
  .style('stroke', d => labels.includes(d.country) ? '#000' : '#fff')
  .append("title")
  .text(d => d.country);
  
  countries.filter(d => labels.includes(d.country))
  .append('text')
  .attr('x', 0)
  .attr('y', -12)
  .text(d => d.country)
  .style('text-anchor', 'middle')
  .style('font-weight', d => d.country == 'United States' ? 600 : 300)
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Appendix`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Sources:
* [Census population predictions](https://www.census.gov/programs-surveys/popproj.html)
* [OECD&rsquo;s Government at a Glance](https://www.oecd.org/gov/government-at-a-glance-2017-contextual-factors.pdf)`
)});
  main.variable(observer("oecd")).define("oecd", ["d3"], function(d3)
{
  let data = d3.csv('https://gist.githubusercontent.com/sahilchinoy/c762cc0f3a6cf7a301d18c42355dc0d2/raw/7d54978e7edb89ca71260b7248999963298f78f3/oecd.csv', d => {
    return {
      country: d.country,
      population: +d.population,
      seats: +d.seats
    }
  });
  
  return data;
}
);
  main.variable(observer("houseSize")).define("houseSize", ["d3"], function(d3){return(
d3.tsvParse(`year	seats
1789	64
1790	65
1791	67
1792	69
1793	105
1796	106
1803	142
1812	143
1813	182
1816	183
1817	184
1818	185
1819	186
1820	186
1821	187
1823	213
1833	240
1836	241
1837	242
1843	223
1845	226
1846	228
1848	230
1849	231
1850	233
1853	234
1858	236
1859	237
1861	238
1862	239
1863	241
1864	242
1867	243
1873	292
1876	293
1883	325
1889	330
1890	332
1893	356
1896	357
1903	386
1907	391
1912	394
1913	435
1933	435
1943	435
1953	435
1959	437
1963	435
2020	435`, d => {
  return {
    year: +d.year,
    reps: +d.seats
  }
})
)});
  main.variable(observer("population")).define("population", ["d3","states"], function(d3,states){return(
d3.csvParse(`year,people
1790,3929214
1800,5308483
1810,7239881
1820,9638453
1830,12866020
1840,17069453
1850,23191876
1860,31443321
1870,38558371
1880,50189209
1890,62979766
1900,76212168
1910,92228496
1920,106021537
1930,123202624
1940,132164569
1950,151325798
1960,179323175
1970,203302031
1980,226542199
1990,248709873
2000,281421906
2010,308745539
2018,328798286
2020,332639000`, d => {
    return {
      year: +d.year,
      population: +d.people,
      reps: (+d.people) ** (1/3) - 2 * (states.filter(s => s <= d.year).length)
    }
  })
)});
  main.variable(observer("states")).define("states", ["d3"], function(d3){return(
d3.csvParse(`StateNo,State,date,Formed from
1,Delaware,"December 7, 1787[8](ratified)",Colony of Delaware[b]
2,Pennsylvania,"December 12, 1787[10](ratified)",Proprietary Province of Pennsylvania
3,New Jersey,"December 18, 1787[11](ratified)",Crown Colony of New Jersey
4,Georgia,"January 2, 1788[8](ratified)",Crown Colony of Georgia
5,Connecticut,"January 9, 1788[12](ratified)",Crown Colony of Connecticut
6,Massachusetts,"February 6, 1788[8](ratified)",Crown Colony of Massachusetts Bay
7,Maryland,"April 28, 1788[8](ratified)",Proprietary Province of Maryland
8,South Carolina,"May 23, 1788[8](ratified)",Crown Colony of South Carolina
9,New Hampshire,"June 21, 1788[8](ratified)",Crown Colony of New Hampshire
10,Virginia,"June 25, 1788[8](ratified)",Crown Colony and Dominion of Virginia
11,New York,"July 26, 1788[13](ratified)",Crown Colony of New York
12,North Carolina,"November 21, 1789[14](ratified)",Crown Colony of North Carolina
13,Rhode Island,"May 29, 1790[8](ratified)",Crown Colony of Rhode Island and Providence Plantations
14,Vermont,"March 4, 1791[15](admitted)",Vermont Republic[c]
15,Kentucky,"June 1, 1792[16](admitted)",Virginia (nine counties in its District of Kentucky[d])
16,Tennessee,"June 1, 1796[18](admitted)",Southwest Territory
17,Ohio,"March 1, 1803[19][e](admitted)",Northwest Territory (part)
18,Louisiana,"April 30, 1812[21](admitted)",Territory of Orleans
19,Indiana,"December 11, 1816(admitted)",Indiana Territory
20,Mississippi,"December 10, 1817[22](admitted)",Mississippi Territory
21,Illinois,"December 3, 1818[23](admitted)",Illinois Territory (part)
22,Alabama,"December 14, 1819[24](admitted)",Alabama Territory
23,Maine,"March 15, 1820[25](admitted)",Massachusetts (District of Maine[f])
24,Missouri,"August 10, 1821[26](admitted)",Missouri Territory (part)
25,Arkansas,"June 15, 1836[27](admitted)",Arkansas Territory
26,Michigan,"January 26, 1837[28](admitted)",Michigan Territory
27,Florida,"March 3, 1845(admitted)",Florida Territory
28,Texas,"December 29, 1845(admitted)",Republic of Texas
29,Iowa,"December 28, 1846(admitted)",Iowa Territory (part)
30,Wisconsin,"May 29, 1848[29](admitted)",Wisconsin Territory (part)
31,California,"September 9, 1850[30](admitted)",unorganized territory (part)
32,Minnesota,"May 11, 1858[31](admitted)",Minnesota Territory (part)
33,Oregon,"February 14, 1859(admitted)",Oregon Territory (part)
34,Kansas,"January 29, 1861[32](admitted)",Kansas Territory (part)
35,West Virginia,"June 20, 1863[33](admitted)",Virginia (50 Trans-Allegheny region counties[g])
36,Nevada,"October 31, 1864(admitted)",Nevada Territory
37,Nebraska,"March 1, 1867(admitted)",Nebraska Territory
38,Colorado,"August 1, 1876[36](admitted)",Colorado Territory
39[h],North Dakota,"November 2, 1889[38][i](admitted)",Dakota Territory (part)
40,South Dakota,"November 2, 1889[38][i](admitted)",Dakota Territory (part)
41,Montana,"November 8, 1889[39](admitted)",Montana Territory
42,Washington,"November 11, 1889[40](admitted)",Washington Territory
43,Idaho,"July 3, 1890(admitted)",Idaho Territory
44,Wyoming,"July 10, 1890(admitted)",Wyoming Territory
45,Utah,"January 4, 1896[41](admitted)",Utah Territory
46,Oklahoma,"November 16, 1907[42](admitted)",Oklahoma Territory and Indian Territory
47,New Mexico,"January 6, 1912(admitted)",New Mexico Territory
48,Arizona,"February 14, 1912(admitted)",Arizona Territory
49,Alaska,"January 3, 1959(admitted)",Territory of Alaska
50,Hawaii,"August 21, 1959(admitted)",Territory of Hawaii
`, d => {
  return {
    year: +d.date.split(',')[1].slice(1, 5)
  }
}).map(d => d.year)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  return main;
}
