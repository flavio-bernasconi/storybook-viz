import React, { useEffect, useState } from "react";
import { number } from "@storybook/addon-knobs";

import { ChartOne } from "./Chart-1";
import { ChartTwo } from "./Chart-2";
import { ChartThree } from "./Chart-3";

export default {
  title: "Example/Chart",
  argTypes: {
    backgroundColor: { control: "color" },
    number: { control: "number" },
  },
};

function randomWithRange(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

const randomData = ({ size, range = [20, 200], radiusRange = [5, 20] }) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 40)).map(
    () => ({
      x: randomWithRange(randomWithRange(...range), randomWithRange(...range)),
      y: randomWithRange(randomWithRange(...range), randomWithRange(...range)),
      r: randomWithRange(1, randomWithRange(...radiusRange)),
    })
  );
};

const ChartUpdateAxis = (args) => {
  const label = "Dataset size";
  const defaultValue = 20;
  const value = number(label, defaultValue);
  const datasetParams = {
    size: value,
    range: [10, 100],
    radiusRange: [10, 15],
  };

  const [dataset, setDataset] = useState(randomData(datasetParams));

  return (
    <>
      <input
        type="range"
        onChange={() => setDataset(randomData(datasetParams))}
      />
      <ChartOne {...args} dataset={dataset} />
    </>
  );
};

export const ChartUpdateAxisSB = ChartUpdateAxis.bind({});
ChartUpdateAxisSB.args = {
  primary: true,
};

const ChartWithZoom = (args) => {
  const dataset = randomData({
    size: 500,
    fixedRadius: true,
    range: [-3000, 3000],
  });

  return <ChartTwo {...args} dataset={dataset} width={1000} height={500} />;
};

export const ChartWithZoomSB = ChartWithZoom.bind({});
ChartUpdateAxisSB.args = {
  primary: true,
};
