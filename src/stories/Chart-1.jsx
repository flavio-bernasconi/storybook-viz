import { useEffect, useState } from "react";
import * as d3 from "d3";

const margin = { top: 10, right: 40, bottom: 30, left: 30 };
const width = 450 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const renderChart = ({ dataset }) => {
  d3.select("#outer-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const svg = d3
    .select("#inner-chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X scale and Axis
  const listXCoordinates = dataset.map((d) => d.x);
  const xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, d3.max(listXCoordinates)]) // Space dimensions
    .nice();

  const xAxis = svg
    .select("#xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(9));

  // X scale and Axis
  const listYCoordinates = dataset.map((d) => d.y);
  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(listYCoordinates)])
    .nice();

  const yAxis = svg.select("#yAxis").call(d3.axisLeft(yScale));

  //console.log(xScale.domain());
  //console.log(yScale.domain());

  const chartElements = svg.selectAll("circle").data(dataset);

  //elements entering the chart
  const chartEnter = chartElements
    .enter()
    .append("circle")
    .attr("fill", "green")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", (d) => d.r);

  //elements to remove
  chartElements
    .exit()
    .style("opacity", 1)
    .transition()
    .duration(1500)
    .attr("fill", "red")
    .style("opacity", 0)
    .remove();

  chartEnter
    .merge(chartElements)
    .style("fill-opacity", 0.5)
    .attr("stroke", "black")
    .attr("stroke-stroke", 2)
    .transition()
    .duration(1500)
    .attr("fill", "blue")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", (d) => d.r);
};

export function ChartOne({ dataset }) {
  useEffect(() => {
    console.log("---- dataset as changed ----", dataset);
    renderChart({ dataset });
  }, [dataset]);

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
