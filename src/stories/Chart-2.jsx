import * as d3 from "d3";
import { useEffect } from "react";
import { MARGIN, WIDTH, HEIGHT } from "./constants";

const colorText = () => {
  d3.selectAll(".tick").select("line").attr("stroke", "red");
  d3.selectAll("text").attr("fill", "white");
  d3.selectAll(".domain").attr("stroke", "black");
};

export const renderChart = (dataset) => {
  // append the svg object to the body of the page
  d3.select("#outer-chart")
    .attr("width", WIDTH + 50)
    .attr("height", HEIGHT + 50)
    .style("background", "black")
    .style("color", "white");

  const svg = d3
    .select("#inner-chart")
    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

  // X axis and Scale
  const listXCoordinates = dataset.map((d) => d.x);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(listXCoordinates)) // Space
    .range([0, WIDTH])
    .nice();

  const xAxis = svg
    .select("#xAxis")
    .attr("transform", "translate(0," + HEIGHT + ")")
    .call(d3.axisBottom(xScale).ticks(9));

  // Y axis and Scale
  const listYCoordinates = dataset.map((d) => d.y);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(listYCoordinates))
    .range([HEIGHT, 0])
    .nice();

  const yAxis = svg.select("#yAxis").call(d3.axisLeft(yScale));

  //color scale
  const listRadius = dataset.map((d) => d.r);

  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(listRadius))
    .range(["white", "blue"]);

  const radiusScale = d3
    .scaleLinear()
    .domain(d3.extent(listRadius))
    .range([1, 8]);

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg
    .append("defs")
    .append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("x", 0)
    .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  const scatter = svg.append("g").attr("clip-path", "url(#clip)");

  // Add circles
  const chartNodes = scatter.selectAll("circle").data(dataset);

  chartNodes.exit().remove();
  chartNodes
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", (d) => radiusScale(d.r))
    .style("fill", (d) => colorScale(d.r))
    .style("stroke", "white")
    .style("fill-opacity", 0.8)
    .style("stroke-width", 0.2)
    .style("opacity", 1);

  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  const zoom = d3
    .zoom()
    .scaleExtent([0.2, 40]) // This control how much you can unzoom (x0.5) and zoom (x20)
    .extent([
      [0, 0],
      [WIDTH, HEIGHT],
    ])
    .on("zoom", updateChart);

  // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
  svg
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")")
    .call(zoom);
  // now the user can zoom and it will trigger the function called updateChart
  colorText();
  // A function that updates the chart when the user zoom and thus new boundaries are available
  function updateChart() {
    // recover the new scale
    const newXScale = d3.event.transform.rescaleX(xScale);
    const newYScale = d3.event.transform.rescaleY(yScale);

    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newXScale));
    yAxis.call(d3.axisLeft(newYScale));
    colorText();

    // console.log(d3.event.transform.k);

    // update circle position
    scatter
      .selectAll("circle")
      .attr("cx", (d) => newXScale(d.x))
      .attr("cy", (d) => newYScale(d.y))
      .attr("r", (d) => radiusScale(d.r) * d3.event.transform.k);
  }
};

export function ChartTwo({ dataset }) {
  useEffect(() => {
    renderChart(dataset);
  }, []);

  return (
    <div className="Chart">
      <svg id="outer-chart">
        <g id="inner-chart">
          <g id="xAxis"></g>
          <g id="yAxis"></g>
        </g>
      </svg>
    </div>
  );
}
