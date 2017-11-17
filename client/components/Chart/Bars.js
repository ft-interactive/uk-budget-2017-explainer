// @flow

import React from 'react';
import classNames from 'class-names';

type BarsProps = {
  projection: number[],
  labels: string[],
  extent: number,
  showCap: boolean,
  highlightCap: boolean,
  fiscalCap: number,
  zoomOut: boolean,
  ghostMarkers: null | number[],
  ghostBars: null | number[],
};

const Bars = ({
  projection,
  labels,
  extent,
  showCap,
  highlightCap,
  fiscalCap,
  zoomOut,
  ghostMarkers,
  ghostBars,
}: BarsProps) => (
  <div
    className={classNames(
      'bars',
      showCap && 'bars--show-cap',
      highlightCap && 'bars--highlight-cap',
      zoomOut && 'bars--zoom-out',
    )}
  >
    {projection.map((value, i) => {
      const isCapYear = i === 3;
      const multiplier = 100 / extent;
      const valueX = value * multiplier;
      const capX = fiscalCap * multiplier;
      const headroomWidth = capX - valueX;
      const smallHeadroom = headroomWidth < 40;

      return (
        <div key={i.toString()} className="bar-track">
          <div className="label">
            {i === 0 && 'Years '}
            {labels[i]}
          </div>

          {isCapYear ? (
            <div
              className={classNames(
                'bar-shadow bar-shadow--headroom',
                isCapYear && highlightCap && smallHeadroom && 'bar-shadow--danger',
              )}
              style={{ width: `${capX}%` }}
            >
              <div
                className={classNames('headroom-label', smallHeadroom && 'headroom-label--small')}
              >{`£${Math.round((fiscalCap - value) * 10) / 10}bn`}</div>
            </div>
          ) : null}

          {ghostBars ? (
            <div
              className={classNames('ghost-bar')}
              style={{ width: `${ghostBars[i] * multiplier}%` }}
            />
          ) : null}

          {/* {(() => {
            console.log('ghostBars', ghostBars);
          })()} */}

          <div className="bar" style={{ width: `${valueX}%` }} />

          {ghostMarkers ? (
            <div
              className={classNames(
                'ghost-marker',
                ghostMarkers[i] <= value && 'ghost-marker--within-bar',
              )}
              style={{ left: `${ghostMarkers[i] * multiplier}%` }}
            />
          ) : null}

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
        transition: height 0.25s ease-out;
      }

      .bars--zoom-out {
        height: 40%;
      }

      .bars--zoom-out .label {
        opacity: 0;
      }

      .bar-track {
        position: relative;
        height: 30px;
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

      .bar-shadow--danger {
        background: hsla(10, 40%, 80%, 1);
        transition: background-color 1s linear;
      }

      .headroom-label {
        transition: opacity 0.2s ease-in 0s;
        opacity: 0;
        position: absolute;
        // right: 24px;
        right: 10px;
        font-weight: 600;
        // font-size: 26px;
        font-size: 20px;
        // top: -10px;
        top: -6px;
      }

      .headroom-label--small {
        font-size: 15px;
        top: -4px;
      }

      .bars--show-cap.bars--highlight-cap .headroom-label {
        transition: opacity 0.8s ease-in 0.2s;
      }

      .ghost-bar {
        background: hsla(210, 82%, 39%, 0.05);
        position: absolute;
        top: 16px;
        height: 12px;
        border: 1px dashed hsla(210, 82%, 39%, 0.4);
      }

      .bar {
        height: 12px;
        background: #1262b3;
        transition: width 0.5s ease-out;
        position: absolute;
        top: 16px;
      }

      .ghost-marker {
        height: 12px;
        border-right: 1px dotted #999;
        top: 16px;
        position: absolute;
        transition: background-image 1s linear 1s;
      }

      .ghost-marker--within-bar {
        border-color: white;
      }

      .label {
        transition: opacity 0.15s linear;
        font-size: 14px;
        line-height: 16px;
        position: absolute;
        text-transform: uppercase;
      }

      .fiscal-cap-marker {
        opacity: 0;
        transition: opacity 0.05s ease-in;
        border-left: 4px solid black;
        padding: 2px 0 0 4px;
        height: 30px;
        position: absolute;
        top: 8px;
        text-transform: uppercase;
        width: 20px;
        font-size: 13px;
        line-height: 13px;
      }

      .bars--show-cap.bars--highlight-cap .headroom-label,
      .bars--show-cap .bar-shadow--headroom,
      .bars--show-cap .fiscal-cap-marker {
        opacity: 1;
      }

      @media (min-width: 360px) {
        .headroom-label {
          font-size: 26px;
          top: -10px;
        }
      }

      @media (min-width: 410px) {
        .headroom-label {
          right: 20px;
        }
      }
    `}</style>
  </div>
);

export default Bars;
