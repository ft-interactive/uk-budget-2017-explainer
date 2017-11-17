// @flow

import React from 'react';
import classNames from 'class-names';
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
  showCap: boolean,
  highlightCap: boolean,
  fiscalCapValue: number,
};

const Bars = ({ projection, labels, extent, showCap, highlightCap, fiscalCapValue }: BarsProps) => (
  <div
    className={classNames(
      'bars',
      showCap && 'bars--show-cap',
      highlightCap && 'bars--highlight-cap',
    )}
  >
    {projection.map((value, i) => {
      const isCapYear = i === 3;
      const multiplier = 100 / extent;
      const valueX = value * multiplier;
      const capX = fiscalCapValue * multiplier;

      return (
        <div className="bar-track">
          <div className="label">
            {i === 0 && 'Years '}
            {labels[i]}
          </div>

          {isCapYear ? (
            <div className="bar-shadow bar-shadow--headroom" style={{ width: `${capX}%` }}>
              <div className="headroom-label">{`£${Math.round((fiscalCapValue - value) * 10) /
                10}bn`}</div>
            </div>
          ) : null}

          <div key={i.toString()} className="bar" style={{ width: `${valueX}%` }} />

          {isCapYear ? (
            <div className="fiscal-cap-marker" style={{ left: `${capX}%` }}>
              Fiscal cap
            </div>
          ) : null}
        </div>
      );
    })}
    <style jsx>{`
      .bars {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .bar-track {
        position: relative;
        height: 30px;
        // background: #eee;
      }

      .bar-shadow {
        height: 12px;
        background: #ddd;
        transition: width 0.5s ease-out;
        position: absolute;
        top: 16px;
      }

      .bar-shadow--headroom {
        opacity: 0;
        transition: opacity 0.2s ease-out;
      }

      .headroom-label {
        transition: opacity 0.5s ease-in;
        opacity: 0;
        position: absolute;
        right: 24px;
        font-weight: 600;
        font-size: 24px;
        top: -8px;
      }

      .bar {
        height: 12px;
        background: #1262b3;
        transition: width 0.5s ease-out;
        position: absolute;
        top: 16px;
      }

      .label {
        font-size: 14px;
        line-height: 16px;
        position: absolute;
        text-transform: uppercase;
      }

      .fiscal-cap-marker {
        opacity: 0;
        transition: opacity 0.3s ease-in;
        border-left: 4px solid black;
        padding: 2px 0 0 4px;
        height: 30px;
        position: absolute;
        top: 8px;
        text-transform: uppercase;
        width: 20px;
        font-size: 13px;
        line-height: 13px;
        // margin-top: -18px;
      }

      .bars--show-cap.bars--highlight-cap .headroom-label,
      .bars--show-cap .bar-shadow--headroom,
      .bars--show-cap .fiscal-cap-marker {
        opacity: 1;
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
  showCap: boolean,
  highlightCap: boolean,
};

const normalChartExtent = 60; // it goes up to 60%

/**
 * The component responsible for rendering the chart on mobile
 */

const MobileChart = ({
  heading,
  height,
  width,
  projection,
  barLabels,
  showCap,
  highlightCap,
}: MobileChartProps) => (
  <div className="mobile-chart">
    <h3>
      Public sector net borrowing <span>£bn</span>
    </h3>

    <h4>{heading}</h4>

    <div className="chart-area">
      <Ticks tickSize={10} extent={normalChartExtent} />
      <Bars
        projection={projection}
        labels={barLabels}
        extent={normalChartExtent}
        showCap={showCap}
        highlightCap={highlightCap}
        fiscalCapValue={40}
      />
      {/* {showCap && <FiscalCap value={40} extent={normalChartExtent} />} */}
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
        // outline: 1px solid red;
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
        margin: 0 0 10px;
      }

      .chart-area {
        // outline: 1px solid blue;
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
