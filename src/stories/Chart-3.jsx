import React, { useEffect } from "react";
import * as d3 from "d3";
import { MARGIN, WIDTH, HEIGHT } from "./constants";

const renderChart = () => {
  d3.select("#outer-chart")
    .attr("width", WIDTH + 50)
    .attr("height", HEIGHT + 50);

  const svg = d3
    .select("#inner-chart")
    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

  const colorScale = ["gray", "lightblue", "#B19CD9"];
  const xCenter = [100, 300, 500];

  const numNodes = 50;
  const dataset = d3.range(numNodes).map((_, i) => ({
    radius: Math.random() * 20 + 2,
    category: i % 3,
  }));

  const node = svg
    .select(".nodes")
    .attr("transform", "translate(0,200)")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", (d) => d.radius)
    .style("fill", (d) => colorScale[d.category])
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

  const simulation = d3
    .forceSimulation(dataset)
    .force("charge", d3.forceManyBody().strength(10))
    .force("center", d3.forceCenter(250, 50))
    .force(
      "collision",
      d3.forceCollide().radius((d) => d.radius)
    )
    .on("tick", ticked);

  function ticked() {
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  d3.select("button").on("click", () => {
    d3.forceSimulation(dataset)
      .force("charge", d3.forceManyBody().strength(0.7))
      .force(
        "x",
        d3.forceX().x((d) => xCenter[d.category])
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.radius)
      )
      .on("tick", ticked);
  });
};

export const ChartForce = ({ dataset }) => {
  useEffect(() => {
    renderChart(dataset);
  }, []);

  return (
    <div className="Chart">
      <button>BANG</button>
      <svg id="outer-chart">
        <g id="inner-chart">
          <g class="nodes"></g>
          <g id="xAxis"></g>
          <g id="yAxis"></g>
        </g>
      </svg>
    </div>
  );
};
