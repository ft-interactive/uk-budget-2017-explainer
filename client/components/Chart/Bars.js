// @flow

import React from 'react';
import classNames from 'class-names';
import type { Projection } from '../../types';

type BarsProps = {
  projection: Projection,
  labels: string[],
  extent: number,
  showCap: boolean,
  highlightCap: boolean,
  fiscalCapValue: number,
  zoomOut: boolean,
};

const Bars = ({
  projection,
  labels,
  extent,
  showCap,
  highlightCap,
  fiscalCapValue,
  zoomOut,
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
      const capX = fiscalCapValue * multiplier;
      const headroomWidth = capX - valueX;
      const smallHeadroom = headroomWidth < 40;

      return (
        <div className="bar-track">
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
              >{`£${Math.round((fiscalCapValue - value) * 10) / 10}bn`}</div>
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

      .bar {
        height: 12px;
        background: #1262b3;
        transition: width 0.5s ease-out;
        position: absolute;
        top: 16px;
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