// @flow

import React, { PureComponent } from 'react';
import classNames from 'class-names';
import type { ChartData } from '../../types';
import Ticks from './Ticks';
import Bars from './Bars';

type Props = {
  sceneName: string,
  mode: 'mobile' | 'desktop',
  width: number,
  height: number,
  chartData: ChartData,
  collapsed: boolean,
  showCollapseButton: boolean,
  onCollapseToggle: () => void,
};

const CHART_EXTENT = 60; // chart goes up to 60%

export default class Chart extends PureComponent<Props> {
  props: Props;

  render() {
    // chartData never changes. The other things may change, causing this pure component to
    // re-render.
    const {
      chartData,
      sceneName,
      mode,
      width,
      height,
      collapsed,
      onCollapseToggle,
      showCollapseButton,
    } = this.props;

    const scene = chartData.scenes[sceneName];
    if (!scene) throw new Error(`Unknown scene: ${sceneName}`);

    const { barLabels, fiscalCap, notionalYears } = chartData;
    const { heading, showCap, highlightCap, zoomOut, ghostMarkers, ghostBars } = scene;
    const projection = chartData.projections[scene.projectionId];

    return (
      <figure
        className={classNames(
          'chart',
          `chart--${mode}`,
          zoomOut && 'chart--zoom-out',
          collapsed && 'chart--collapsed',
        )}
        style={{
          width: `${width}px`,
          height: collapsed ? '' : `${height}px`,
        }}
      >
        <header>
          <h3>
            Public sector net borrowing <span>£bn</span>
          </h3>

          <h4>{heading}</h4>

          {showCollapseButton && <button className="toggle-collapse" onClick={onCollapseToggle} />}
        </header>

        <div className="chart-area">
          <Ticks tickSize={10} extent={CHART_EXTENT} horizontal={mode === 'desktop'} />

          <Bars
            extent={CHART_EXTENT}
            fiscalCap={fiscalCap}
            highlightCap={highlightCap}
            labels={barLabels}
            notionalYears={notionalYears}
            showCap={showCap}
            projection={projection}
            zoomOut={zoomOut}
            ghostMarkers={ghostMarkers}
            ghostBars={ghostBars}
            vertical={mode === 'desktop'}
          />

          <div className="zoomed-out-message">Eliminate&nbsp;borrowing by&nbsp;‘mid-2020s’</div>
        </div>

        <style jsx>{`
          .chart {
            position: relative;
            padding: 5px 30px 40px 10px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin: 0;
          }

          .chart--collapsed {
            overflow: hidden;
          }

          .chart--collapsed .chart-area {
            height: 0;
            overflow: hidden;
          }

          .header {
            position: relative;
          }

          .toggle-collapse {
            position: absolute;
            right: 10px;
            top: 10px;
            background: url(https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:cross?source=ig&tint=%23000000);
            border: 0;
            padding: 0;
            width: 30px;
            height: 30px;
            display: block;
            background-size: cover;
          }

          .chart--collapsed .toggle-collapse {
            background: url(https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:plus?source=ig&tint=%23000000);
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
            position: relative;
            flex: 1;
          }

          .zoomed-out-message {
            opacity: 0;
            position: absolute;
            height: 50%;
            color: black;
            max-width: 180px;
            padding-top: 30px;
            padding-left: 50px;
            pointer-events: none;
            transition: opacity 0 linear;
            font-weight: 600;
            font-size: 17px;
          }

          .chart--zoom-out .zoomed-out-message {
            opacity: 1;
            bottom: -0px;
            transition: opacity 1s ease-out 0.2s;
          }

          @media (min-width: 490px) {
            .chart {
              padding-left: 40px;
              padding-right: 40px;
            }
          }
        `}</style>
      </figure>
    );
  }
}
