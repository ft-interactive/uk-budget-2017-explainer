// @flow

import React from 'react';
import invariant from 'invariant';
import classNames from 'class-names';
import type { Projection } from '../../types';
import colours from '../../colours';

const CAP_YEAR_INDEX = 3; // index of the year 2020-21 in projection array

type BarsProps = {
  projection: Projection,
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
    {projection.map(({ value, yearId }, i) => {
      // const isDummy = p.dummy || false;
      // const value = isDummy ? p.value : p;
      invariant(typeof value === 'number', 'must be a number');
      const isCapYear = i === CAP_YEAR_INDEX;
      const multiplier = 100 / extent;
      const valueLength = value * multiplier;
      const fiscalCapLength = fiscalCap * multiplier;
      const headroomLength = fiscalCapLength - valueLength;

      return (
        <div key={yearId} className={classNames('track', isCapYear && 'track--cap-year')}>
          <div className="label">
            {!vertical && i === 0 && 'Years '}
            {labels[i]}
          </div>

          {/* a 'well' under the bar indicating the available length until the cap */}
          {isCapYear ? (
            <div>
              <div
                className="bar-well"
                style={{ [vertical ? 'height' : 'width']: `${fiscalCapLength}%` }}
              />
              <div
                className="headroom-label"
                style={{
                  [vertical ? 'bottom' : 'left']: `${valueLength}%`,
                  [vertical ? 'height' : 'width']: `${headroomLength}%`,
                }}
              >{`£${Math.round((fiscalCap - value) * 10) / 10}bn`}</div>
            </div>
          ) : null}

          {/* the actual, filled bar */}
          <div className="bar" style={{ [vertical ? 'height' : 'width']: `${valueLength}%` }} />

          {/* cap marker */}
          {isCapYear ? (
            <div
              className="fiscal-cap-marker"
              style={{ [vertical ? 'bottom' : 'left']: `${fiscalCapLength}%` }}
            >
              Fiscal cap
            </div>
          ) : null}
        </div>
      );
    })}

    <style jsx>{`
      .bars {
        outline: 1px dotted blue;
      }

      .track {
        height: 15px;
        margin-top: 20px;
        background: rgba(0, 200, 0, 0.1);
        position: relative;
      }

      .label {
        font-size: 14px;
        top: -17px; // bar height, plus a bit more
        position: absolute;
        text-transform: uppercase;
      }

      .bar-well {
        position: absolute;
        height: 100%;
        top: 0;
        background: ${colours.darkBlue};
        transition: width 0.25s ease-out, background 0.15s linear;
        box-shadow: inset 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
        background: #e1e0df;
        opacity: 0;
        transition: opacity 0.15s ease-in;
      }

      .bars--show-cap .bar-well {
        opacity: 1;
        transition: opacity 0.25s ease-in;
      }

      .headroom-label {
        transition: opacity 0.05s ease-in;
        opacity: 0;
        width: 100%;
        text-align: center;
        font-size: 28px;
        font-weight: 600;
        position: absolute;
        top: -9px;
        color: #444;
      }

      .bars--highlight-cap .headroom-label {
        opacity: 1;
        transition: opacity 0.45s ease-in 0.3s;
      }

      .fiscal-cap-marker {
        opacity: 0;
        transition: opacity 0.05s ease-in;
        border-left: 4px solid black;
        padding: 2px 0 0 4px;
        height: 30px;
        position: absolute;
        top: -${(30 - 15) / 2}px;
        text-transform: uppercase;
        width: 20px;
        font-size: 13px;
        line-height: 13px;
      }

      .bars--show-cap .fiscal-cap-marker {
        opacity: 1;
      }

      .bar {
        position: absolute;
        height: 100%;
        top: 0;
        background: ${colours.darkBlue};
        transition: width 0.25s ease-out, background 0.15s linear;
      }

      .bars--highlight-cap .track:not(.track--cap-year) .bar {
        background: ${colours.lightBlue};
      }

      // HORIZONTAL ADAPTATION
      .bars--vertical {
      }
    `}</style>
  </div>
);

export default Bars;
