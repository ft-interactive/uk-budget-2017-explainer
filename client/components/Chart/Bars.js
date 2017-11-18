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
      const valueDimension = value * multiplier;
      const capDimension = fiscalCap * multiplier;
      const headroomWidth = capDimension - valueDimension;
      const smallHeadroom = headroomWidth < 40;

      return (
        <div key={yearId} className={classNames('track', isCapYear && 'track--cap-year')}>
          <div className="label">
            {!vertical && i === 0 && 'Years '}
            {labels[i]}
          </div>

          <div className="bar" style={{ [vertical ? 'height' : 'width']: `${valueDimension}%` }} />
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
