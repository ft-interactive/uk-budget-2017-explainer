// @flow

import React from 'react';
import classNames from 'class-names';
import type { Projection } from '../../types';
import colours from '../../colours';

const CAP_YEAR_INDEX = 3; // index of the year 2020-21 in projection array
const MOBILE_SQUEEZED_MARGIN = 3;
const MOBILE_BAR_THICKNESS = 15;
const MOBILE_TRACK_SPACING = 19;
const ZOOM_TRANSITION_SECONDS = 0.5;

type BarsProps = {
  projection: Projection,
  labels: string[],
  extent: number,
  showCap: boolean,
  highlightCap: boolean,
  fiscalCap: number,
  zoomOut: boolean,
  ghostMarkers: null | Projection,
  ghostBars: null | Projection,
  vertical?: boolean,
  notionalYears: number[],
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
  notionalYears,
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
      const isCapYear = i === CAP_YEAR_INDEX;
      const multiplier = 100 / extent;
      const valueLength = value * multiplier;
      const fiscalCapLength = fiscalCap * multiplier;
      const headroomLength = fiscalCapLength - valueLength;

      return (
        <div key={yearId} className={classNames('track', isCapYear && 'track--cap-year')}>
          {/* the label, which will be shifted outside the track by CSS */}
          <div className="label">
            {!vertical && i === 0 && 'Years '}
            {labels[i]}
          </div>

          {/* a 'well' under the bar, to show how much room until the cap */}
          {isCapYear ? (
            <div>
              <div
                className="bar-well"
                style={{ [vertical ? 'height' : 'width']: `${fiscalCapLength}%` }}
              />
              <div
                className={classNames(
                  'headroom-label',
                  headroomLength < 30 && 'headroom-label--small',
                )}
                style={{
                  [vertical ? 'bottom' : 'left']: `${valueLength}%`,
                  [vertical ? 'height' : 'width']: `${headroomLength}%`,
                }}
              >
                {`£${Math.round((fiscalCap - value) * 10) / 10}bn`}
              </div>
            </div>
          ) : null}

          {/* ghost bars (dotted outline to show a gap) */}
          {ghostBars ? (
            <div
              className="ghost-bar"
              style={{ [vertical ? 'height' : 'width']: `${ghostBars[i].value * multiplier}%` }}
            />
          ) : null}

          {/* the bar itself */}
          <div className="bar" style={{ [vertical ? 'height' : 'width']: `${valueLength}%` }} />

          {ghostMarkers ? (
            <div
              className={classNames(
                'ghost-marker',
                ghostMarkers[i].value <= value && 'ghost-marker--within-bar',
              )}
              style={{
                [vertical ? 'bottom' : 'left']: `${ghostMarkers[i].value * multiplier}%`,
              }}
            />
          ) : null}

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

    {/* notional years (always render them, so they can fade in nicely when needed) */}
    <div className="notional-years">
      {notionalYears.map((value, i) => (
        <div
          key={i.toString()}
          className="notional-year"
          style={{ width: `${value * (100 / extent)}%` }}
        />
      ))}
    </div>

    <style jsx>{`
      .bars {
        height: 100%;
        overflow: hidden;
        width: 100%;
        position: absolute;
      }

      .track {
        transition: height ${ZOOM_TRANSITION_SECONDS}s ease,
          margin-top ${ZOOM_TRANSITION_SECONDS}s ease;
        height: ${MOBILE_BAR_THICKNESS}px;
        margin-top: ${MOBILE_TRACK_SPACING}px;
        position: relative;
      }

      .label {
        font-size: 14px;
        top: -17px; // bar height, plus a bit more
        position: absolute;
        text-transform: uppercase;
        transition: opacity 0.3s linear ${ZOOM_TRANSITION_SECONDS * 0.75}s;
      }

      .ghost-bar {
        background: hsla(210, 82%, 39%, 0.05);
        position: absolute;
        height: 100%;
        border: 1px dashed hsla(210, 82%, 39%, 0.4);
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
        transition: opacity 0s linear;
        opacity: 0;
        width: 100%;
        text-align: center;
        font-size: 30px;
        top: -10px;
        font-weight: 600;
        position: absolute;
        color: #444;
      }

      .headroom-label--small {
        font-size: 16px;
        top: -2px;
      }

      @media (min-width: 450px) {
        .headroom-label--small {
          font-size: 18px;
          top: -3px;
        }
      }

      .bars--highlight-cap .headroom-label {
        opacity: 1;
        transition-duration: 0.45s;
        transition-delay: 0.3s;
      }

      .fiscal-cap-marker {
        opacity: 0;
        transition: opacity 0.05s ease-in, top 0.2s linear, height 0.2s linear,
          background-color 0.2s linear;
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

      .bars--zoom-out .fiscal-cap-marker {
        border-color: #666;
        color: transparent;
        height: 26px;
        top: -${(26 - 15) / 2}px;
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

      .ghost-marker {
        // outline: 3px solid red;
        height: 100%;
        border-left: 1px dotted #999;
        border-right: 1px dotted #999;
        // top: 16px;
        position: absolute;
        transition: border-color 0.5s linear 0s;
        // margin-left: 1px;
        // transform: scaleX(0.5);
      }

      .ghost-marker--within-bar {
        border-color: white;
      }

      .notional-years {
        height: 0;
        overflow: hidden;
      }

      .notional-year {
        opacity: 0;
        margin-top: ${MOBILE_SQUEEZED_MARGIN}px;
        height: ${MOBILE_BAR_THICKNESS}px;
        background: linear-gradient(to right, rgba(56, 71, 149, 0.4) 0%, rgba(56, 71, 149, 0) 98%);
      }

      .bars--zoom-out .notional-years {
        height: auto;
        // display: block;
      }

      .bars--zoom-out .track {
        margin-top: ${MOBILE_SQUEEZED_MARGIN}px;
      }

      .bars--zoom-out .label {
        transition: opacity ${ZOOM_TRANSITION_SECONDS * 0.2}s linear 0s;
        opacity: 0;
      }

      .bars--zoom-out .notional-year {
        opacity: 1;
        transition: opacity 0.4s linear ${ZOOM_TRANSITION_SECONDS * 0.75}s;
      }
      .bars--zoom-out .notional-year:nth-child(2) {
        transition-delay: ${ZOOM_TRANSITION_SECONDS * 0.75 + 0.15}s;
      }
      .bars--zoom-out .notional-year:nth-child(3) {
        transition-delay: ${ZOOM_TRANSITION_SECONDS * 0.75 + 0.3}s;
      }

      // HORIZONTAL ADAPTATION
      .bars--vertical {
      }
    `}</style>
  </div>
);

Bars.defaultProps = { vertical: false };

export default Bars;
