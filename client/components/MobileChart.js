// @flow

import React from 'react';
import type { Projection } from '../types';

type TicksProps = {
  tickSize: number,
  extent: number,
};

const Ticks = ({ tickSize, extent }: TicksProps) => (
  <div className="ticks">
    {Array.from({ length: Math.floor(extent / tickSize) + 1 }).map((v, i) => {
      const value = i * tickSize;

      const xOffsetPercent = value * (100 / extent);

      return (
        <div key={value} className="tick" style={{ left: `${xOffsetPercent}%` }}>
          <div className="label">{value}</div>
        </div>
      );
    })}

    <style jsx>{`
      .ticks {
        position: relative;
        height: 100%;
      }

      .tick {
        position: absolute;
        height: 100%;
      }

      .tick:not(:first-child):after {
        content: '';
        display: block;
        height: 100%;
        width: 1px;
        position: absolute;
        background: gray;
      }

      .label {
        font-size: 14px;
        width: 40px;
        margin-left: -20px;
        text-align: center;
        position: absolute;
        bottom: -16px;
      }
    `}</style>
  </div>
);

type MobileChartProps = {
  heading: string,
  height: number, // including heading, margins
  width: number, // ditto
  projection: Projection,
  showCap: boolean,
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
        width: ${width}px;
        height: ${height}px;
        position: relative;
        padding: 0 20px 40px 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      h3 {
        font-size: 18px;
        font-weight: 400;
      }

      .chart-area {
        position: relative;
        flex: 1;
      }
    `}</style>
  </div>
);

export default MobileChart;
