// @flow

import React from 'react';

type TicksProps = {
  tickSize: number,
  extent: number,
};

const Ticks = ({ tickSize, extent }: TicksProps) => (
  <div className="ticks">
    {Array.from({ length: Math.floor(extent / tickSize) }).map((v, i) => {
      const value = i * tickSize;

      const xOffsetPercent = value * (100 / extent);

      return (
        <div key={value} className="tick" style={{ left: `${xOffsetPercent}px` }}>
          {value}
        </div>
      );
    })}

    <style jsx>{`
      .ticks {
        background: rgba(255, 0, 0, 0.1);
        position: relative;
        height: 100%;
      }

      .tick {
        position: absolute;
      }
    `}</style>
  </div>
);

type MobileChartProps = {
  heading: string,
  height: number, // including heading, margins
  width: number, // ditto
};

const MobileChart = ({ heading, height, width }: MobileChartProps) => (
  <div className="mobile-chart">
    <h3>{heading}</h3>

    <div className="chart-area">
      <Ticks tickSize={10} extent={60} />
      {/* <Bars /> */}
    </div>

    <style jsx>{`
      .mobile-chart {
        outline: 1px solid red;
        width: ${width}px;
        height: ${height}px;
        position: relative;
        padding: 10px;
        display: flex;
        flex-direction: column;
      }

      .chart-area {
        outline: 1px solid green;
        position: relative;
      }
    `}</style>
  </div>
);

export default MobileChart;
