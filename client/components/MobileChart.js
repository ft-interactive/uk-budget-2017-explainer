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
        position: absolute;
        height: 100%;
        width: 100%;
      }

      .tick {
        position: absolute;
        height: 100%;
      }

      .tick:not(:first-child):after {
        content: '';
        display: block;
        height: 10px;
        width: 1px;
        position: absolute;
        background: gray;
        bottom: -14px;
      }

      .label {
        font-size: 14px;
        width: 40px;
        margin-left: -20px;
        text-align: center;
        position: absolute;
        bottom: -30px;
      }
    `}</style>
  </div>
);

type BarsProps = {
  projection: Projection,
  labels: string[],
  extent: number,
};

const Bars = ({ projection, labels, extent }: BarsProps) => (
  <div className="bars">
    {projection.map((value, i) => (
      <div key={i.toString()} className="bar" style={{ width: `${value * (100 / extent)}%` }}>
        <div className="label">
          {i === 0 && 'Years '}
          {labels[i]}
        </div>
      </div>
    ))}
    <style jsx>{`
      .bars {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .bar {
        height: 12px;
        background: #1262b3;
        transition: width 0.5s ease-out;
      }

      .label {
        font-size: 14px;
        line-height: 16px;
        position: relative;
        top: -18px;
        text-transform: uppercase;
      }
    `}</style>
  </div>
);

type MobileChartProps = {
  heading: string,
  height: number,
  width: number,
  projection: Projection,
  barLabels: string[],
  // showCap: boolean,
};

const normalChartExtent = 60; // it goes up to 60%

/**
 * The component responsible for rendering the chart on mobile
 */

const MobileChart = ({ heading, height, width, projection, barLabels }: MobileChartProps) => (
  <div className="mobile-chart">
    <h3>
      Public sector net borrowing <span>£bn</span>
    </h3>
    <h4>{heading}</h4>

    <div className="chart-area">
      <Ticks tickSize={10} extent={normalChartExtent} />
      <Bars projection={projection} labels={barLabels} extent={normalChartExtent} />
    </div>

    <style jsx>{`
      .mobile-chart {
        width: ${width}px;
        height: ${height}px;
      }
    `}</style>

    <style jsx>{`
      .mobile-chart {
        position: relative;
        padding: 5px 30px 40px 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      h3 {
        font-size: 16px;
        margin: 0;
      }

      h3 > span {
        font-weight: 400;
      }

      h4 {
        font-size: 14px;
        font-weight: 400;
        margin: 0 0 30px;
      }

      .chart-area {
        position: relative;
        flex: 1;
      }

      @media (min-width: 490px) {
        .mobile-chart {
          padding-left: 40px;
          padding-right: 40px;
        }
      }
    `}</style>
  </div>
);

export default MobileChart;
