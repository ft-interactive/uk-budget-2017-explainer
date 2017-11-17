/**
 * The component responsible for rendering the chart on desktop.
 *
 * @flow
 */

import React from 'react';
import classNames from 'class-names';
import Ticks from './Ticks';
import Bars from './Bars';
import type { ChartProps } from '../../types';

const normalChartExtent = 60; // chart goes up to 60%

const DesktopChart = ({
  heading,
  height,
  width,
  projection,
  barLabels,
  showCap,
  highlightCap,
  zoomOut,
  fiscalCap,
  ghostMarkers,
  ghostBars,
}: ChartProps) => (
  <div className={classNames('desktop-chart', zoomOut && 'desktop-chart--zoom-out')}>
    <h3>
      Public sector net borrowing <span>£bn</span>
    </h3>

    <h4>{heading}</h4>

    <div className="chart-area">
      <Ticks horizontal tickSize={10} extent={normalChartExtent} />
      <Bars
        vertical
        projection={projection}
        labels={barLabels}
        extent={normalChartExtent}
        showCap={showCap}
        highlightCap={highlightCap}
        zoomOut={zoomOut}
        fiscalCap={fiscalCap}
        ghostMarkers={ghostMarkers}
        ghostBars={ghostBars}
      />

      <div className="zoomed-out-message">Eliminate borrowing by ‘mid&nbsp;2020s’</div>
    </div>

    <style jsx>{`
      .desktop-chart {
        width: ${width}px;
        height: ${height}px;
      }
    `}</style>

    <style jsx>{`
      .desktop-chart {
        // outline: 1px solid blue;
        position: relative;
        padding: 5px 30px 10px 10px;
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
        margin: 0 0 10px;
      }

      .chart-area {
        margin-top: 10px;
        position: relative;
        flex: 1;
      }

      .zoomed-out-message {
        opacity: 0;
        bottom: -60px;
        position: absolute;
        height: 50%;
        color: #1262b3;
        background-image: linear-gradient(
          to bottom,
          rgba(18, 98, 179, 0),
          rgba(18, 98, 179, 0) 100%
        );
        width: 100%;
        padding-top: 20px;
        text-align: center;
        pointer-events: none;
        transition: opacity 0.15s ease-out, bottom 0.25s ease-out;
        font-weight: 600;
        font-size: 22px;
      }

      .desktop-chart--zoom-out .zoomed-out-message {
        opacity: 1;
        background: linear-gradient(to bottom, rgba(18, 98, 179, 0), rgba(18, 98, 179, 0.1) 100%);
        bottom: -15px;
        transition: opacity 1s ease-out 0.2s, bottom 0.45s ease-out, background-image 2s linear;
      }

      @media (min-width: 490px) {
        .desktop-chart {
          padding-left: 40px;
          padding-right: 40px;
        }
      }
    `}</style>
  </div>
);

export default DesktopChart;
