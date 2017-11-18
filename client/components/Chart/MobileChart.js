/**
 * The component responsible for rendering the chart on mobile.
 *
 * @flow
 */

import React from 'react';
import classNames from 'class-names';
import Ticks from './Ticks';
import Bars from './Bars';
import type { ChartProps } from '../../types';

const normalChartExtent = 60; // chart goes up to 60%

const MobileChart = ({
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
  notionalYears,
}: ChartProps) => (
  <div className={classNames('mobile-chart', zoomOut && 'mobile-chart--zoom-out')}>
    <h3>
      Public sector net borrowing <span>£bn</span>
    </h3>

    <h4>{heading}</h4>

    <div className="chart-area">
      <Ticks tickSize={10} extent={normalChartExtent} horizontal={false} />

      <Bars
        projection={projection}
        labels={barLabels}
        extent={normalChartExtent}
        showCap={showCap}
        highlightCap={highlightCap}
        zoomOut={zoomOut}
        fiscalCap={fiscalCap}
        ghostMarkers={ghostMarkers}
        ghostBars={ghostBars}
        notionalYears={notionalYears}
        vertical={false} // why is flow requiring this?
      />

      <div className="zoomed-out-message">Eliminate borrowing by ‘mid&nbsp;2020s’</div>
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
        margin: 0 0 10px;
      }

      .chart-area {
        // outline: 1px solid blue;
        position: relative;
        flex: 1;
        // overflow: hidden; // cannot hide because ticks etc. need to be in margins
      }

      .zoomed-out-message {
        opacity: 0;
        position: absolute;
        height: 50%;
        color: black;
        width: 75%;
        padding-top: 20px;
        padding-left: 40px;
        pointer-events: none;
        transition: opacity 0 linear;
        font-weight: 600;
        font-size: 17px;
      }

      .mobile-chart--zoom-out .zoomed-out-message {
        opacity: 1;
        bottom: -0px;
        transition: opacity 1s ease-out 0.2s;
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
