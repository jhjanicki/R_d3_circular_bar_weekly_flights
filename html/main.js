
const length = 1000;
const marginLength = 30;

const margin = {
    "top": marginLength,
    "left": marginLength,
    "bottom": marginLength,
    "right": marginLength
}

const innerRadius = 0.2 * length / 3.5;
const outerRadius = length /3;

let cleanedData = data.filter(d=>{
    let year = +d.week.slice(0, 4);
    return year===2022;
}) // filter a specific year here

cleanedData = cleanedData.map(d => {
    return {
        timestamp: d.week,
        value: +d.total
    }
})

//format the x-axis labels
const dateFormat = d3.timeFormat("%Y-%m-%d");

const minDate = new Date("2022-01-01");
const maxDate = new Date("2022-12-31");

//scales
const xScale = d3.scaleBand().domain(cleanedData.map(d => new Date(d.timestamp))).range([0, 2 * Math.PI])
const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.total))  //if only want to show one year, cleanData. d=>d.value
    .range([innerRadius, outerRadius]);

const colorScale = d3.scaleSequential(d3.interpolateInferno)
    .domain(d3.extent(data, d => d.total).reverse())

//arc generator
const arc = d3.arc()
    .innerRadius(yScale(0))
    .outerRadius(d => yScale(d.value))
    .startAngle(d => xScale(new Date(d.timestamp)))
    .endAngle(d => xScale(new Date(d.timestamp)) + xScale.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)

//svg
const svg = d3.select("#chart").append("svg").attr("width", length).attr("height", length);
const g = svg.append("g").attr("transform", `translate(${length / 2},${length / 2})`);

g.selectAll('path')
    .data(cleanedData)
    .join('path')
    .attr('fill', d => colorScale(d.value))
    .attr('stroke', d => colorScale(d.value))
    .attr('d', arc);

g.append('text')
    .attr('text-anchor', 'end')
    .attr('x', '-0.5em')
    .attr('y', d => -yScale(yScale.ticks(5).pop()) - 10)
    .attr('dy', '-1em')
    .style('fill', '#1a1a1a')
    .text('Number of flights / week')

g.selectAll("circle")
    .data(yScale.ticks(5))
    .join('circle')
    .attr('fill', 'none')
    .style('stroke', '#aaa')
    .style('stroke-opacity', 0.5)
    .attr('r', yScale)

g.selectAll('text.xLabel')
    .data(yScale.ticks(5))
    .join('text')
    .attr('class', "xLabel")
    .attr('x', 0)
    .attr('y', d => -yScale(d))
    .attr('dy', '0.35em')
    .style("fill", '#1a1a1a')
    .text(yScale.tickFormat(6, 's'))


const xAxis = g.selectAll("g.axis")
.data([ '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3' ])
.join('g')
.attr("class","axis")
  .attr('transform', (d,i,arr) => `
    rotate(${ i * 360/arr.length })
    translate(${innerRadius},0)
  `)
  
  xAxis.append('line')
  .attr('x1', -5)
  .attr('x2', outerRadius - innerRadius + 10)
  .style('stroke', '#aaa')
  xAxis.append('text')
            .attr('transform', (d,i,arr) => ((i * 360/arr.length) % 360 > 180
                ? "rotate(90)translate(0,16)"
                : "rotate(-90)translate(0,-9)"))
            .style('font-family', 'sans-serif')
            .style('font-size', 10)
            .text(d => d)