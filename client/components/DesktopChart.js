// @flow

import React from 'react';

type DesktopChartProps = {
  heading: string,
  width: number,
  height: number,
};

/**
 * The component responsible for rendering the chart on desktop.
 */

const DesktopChart = ({ heading, width, height }: DesktopChartProps) => (
  <div className="desktop-chart">
    <h3>{heading}</h3>

    <div>tktktk</div>

    <style jsx>{`
      .desktop-chart {
        width: ${width}px;
        height: ${height}px;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        outline: 1px solid red;
      }

      h3 {
        font-size: 24px;
        font-weight: 400;
        margin: 0 0 30px;
      }
    `}</style>
  </div>
);

export default DesktopChart;
