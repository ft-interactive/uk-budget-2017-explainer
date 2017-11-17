// @flow

import React from 'react';
import classNames from 'class-names';

const CAP_YEAR_INDEX = 3; // index of the year 2020-21 in projection array

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
  vertical: boolean | void,
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
  vertical,
}: BarsProps) => (
  <div
    className={classNames(
      'bars',
      showCap && 'bars--show-cap',
      highlightCap && 'bars--highlight-cap',
      zoomOut && 'bars--zoom-out',
      vertical && 'bars--vertical',
    )}
  >
    {projection.map((value, i) => {
      const isCapYear = i === CAP_YEAR_INDEX;
      const multiplier = 100 / extent;
      const valueDimension = value * multiplier;
      const capDimension = fiscalCap * multiplier;
      const headroomWidth = capDimension - valueDimension;
      const smallHeadroom = headroomWidth < 40;

      return (
        <div
          key={i.toString()}
          className={classNames(
            'bar-track',
            isCapYear ? 'bar-track--cap-year' : 'bar-track--non-cap-year',
          )}
        >
          <div className="label">
            {!vertical && i === 0 && 'Years '}
            {labels[i]}
          </div>

          {isCapYear ? (
            <div
              className={classNames(
                'bar-shadow bar-shadow--headroom',
                isCapYear && highlightCap && smallHeadroom && 'bar-shadow--danger',
              )}
              style={{ [vertical ? 'height' : 'width']: `${capDimension}%` }}
            >
              <div
                className={classNames('headroom-label', smallHeadroom && 'headroom-label--small')}
              >{`£${Math.round((fiscalCap - value) * 10) / 10}bn`}</div>
            </div>
          ) : null}

          {ghostBars ? (
            <div
              className={classNames('ghost-bar')}
              style={{ [vertical ? 'height' : 'width']: `${ghostBars[i] * multiplier}%` }}
            />
          ) : null}

          {/* {(() => {
            console.log('ghostBars', ghostBars);
          })()} */}

          <div className="bar" style={{ [vertical ? 'height' : 'width']: `${valueDimension}%` }} />

          {ghostMarkers ? (
            <div
              className={classNames(
                'ghost-marker',
                ghostMarkers[i] <= value && 'ghost-marker--within-bar',
              )}
              style={{ [vertical ? 'bottom' : 'left']: `${ghostMarkers[i] * multiplier}%` }}
            />
          ) : null}

          {isCapYear ? (
            <div
              className="fiscal-cap-marker"
              style={{ [vertical ? 'bottom' : 'left']: `${capDimension}%` }}
            >
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
        background: #e1e0df;
        transition: width 0.5s ease-out;
        position: absolute;
        top: 16px;
      }

      .bar-shadow--headroom {
        opacity: 0;
        transition: opacity 0.2s ease-out;
        box-shadow: inset 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
      }

      // .bar-shadow--danger {
      // background: hsla(10, 40%, 80%, 1);
      // transition: background-color 1s linear;
      // }

      // .bar-shadow--danger .headroom-label {
      //   color: #601c2e;
      // }

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
        background: #394795;
        transition: width 0.5s ease-out, background-color 0.3s linear;
        position: absolute;
        top: 16px;
      }

      .ghost-marker {
        height: 12px;
        border-right: 1px dotted #999;
        top: 16px;
        position: absolute;
        transition: border-color 1s linear 1s;
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

      .bars--show-cap.bars--highlight-cap .bar-track--cap-year .label {
        font-weight: 500;
      }

      .bars--show-cap.bars--highlight-cap .bar-track--non-cap-year .label {
        opacity: 0.7;
      }

      .bars--show-cap.bars--highlight-cap .bar-track--non-cap-year .bar {
        background-color: #a1b2db;
      }

      // VERTICAL
      .bars--vertical {
        flex-direction: row;
      }

      .bars--vertical {
        transition: width 0.25s ease-out;
      }

      .bars--vertical.bars--zoom-out {
        width: 50%;
        height: 100%;
      }

      .bars--vertical .fiscal-cap-marker {
        display: none;
      }

      .bars--vertical .bar-track {
        height: 100%;
        width: 60px;
      }

      .bars--vertical .bar {
        width: 40px;
        position: absolute;
        bottom: 0;
        top: auto;
        transition: width 0.2s ease-out, height 0.5s ease-out, background-color 0.3s linear;
      }

      .bars--vertical.bars--zoom-out .bar {
        width: 30px;
        transition: width 0.25s ease-out, height 0.5s ease-out, background-color 0.3s linear;
      }

      .bars--vertical .label {
        bottom: -20px;
        top: auto;
      }

      .bars--vertical .ghost-marker {
        height: 2px;

        background-image: linear-gradient(to right, #999 50%, rgba(255, 255, 255, 0) 0%);
        background-position: bottom;
        background-size: 6px 2px;
        background-repeat: repeat-x;

        width: 40px;
        border-right: 0;
        // border-top: 2px dashed #888;
        top: auto;
        margin-bottom: -2px;
      }

      .bars--vertical .ghost-marker--within-bar {
        border-color: #aaa;
      }

      .bars--vertical .ghost-bar {
        width: 40px;
        top: auto;
        bottom: 0;
      }

      // ADJUSTMENTS
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
