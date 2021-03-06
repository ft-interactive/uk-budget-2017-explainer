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
const DESKTOP_BAR_THICKNESS = 45;
const DESKTOP_BAR_SQUEEZED_THICKNESS = 30;
const DESKTOP_TRACK_SPACING = 15;
const DESKTOP_SQUEEZED_MARGIN = 5;

type BarsProps = {
  projection: Projection,
  labels: string[],
  extent: number,
  showCap: boolean,
  highlightCap: boolean,
  fiscalCap: number,
  zoomOut: boolean,
  ghostMarkers?: null | Projection,
  ghostBars?: null | Projection,
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
          {/* a 'well' under the bar, to show how much room until the cap */}
          {isCapYear ? (
            <div>
              <div
                className="well"
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

          {/* the label, which will be shifted outside the track by CSS */}
          <div className="label">
            {!vertical && i === 0 && 'Years '}
            {labels[i]}
          </div>
        </div>
      );
    })}

    {/* notional years (render them on all scenes, so they're ready to fade in when needed) */}
    <div className="notional-years">
      {notionalYears.map((value, i) => (
        <div
          key={i.toString()}
          className="notional-year"
          style={{ [vertical ? 'height' : 'width']: `${value * (100 / extent)}%` }}
        />
      ))}
    </div>

    <style jsx>{`
      .bars {
        height: 100%;
        // overflow: hidden;
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
        white-space: nowrap;
        text-align: center;
      }

      .ghost-bar {
        background: hsla(210, 82%, 39%, 0.05);
        position: absolute;
        height: 100%;
        border: 1px dashed hsla(210, 82%, 39%, 0.4);
      }

      .well {
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

      .bars--show-cap .well {
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
        height: 100%;
        border-left: 1px dotted #999;
        border-right: 1px dotted #999;
        position: absolute;
        transition: border-color 0.5s linear 0s;
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

      // overrides for horizontal bars
      .bars--vertical {
        display: flex;
        // outline: 1px solid blue;
      }

      .bars--vertical .track {
        height: 100%;
        transition: width ${ZOOM_TRANSITION_SECONDS}s ease,
          margin-left ${ZOOM_TRANSITION_SECONDS}s ease;
        width: ${DESKTOP_BAR_THICKNESS}px;
        margin: 0 0 0 ${DESKTOP_TRACK_SPACING}px;
        // outline: 1px solid pink;
      }

      .bars--vertical .bar {
        // outline: 1px solid red;
        width: 100%;
        top: auto;
        bottom: 0;
        transition: height 0.25s ease-out, background 0.15s linear;
      }

      .bars--vertical .label {
        bottom: -20px;
        top: auto;
        // outline: 1px solid blue;
        width: ${60}px;
        margin-left: -${(60 - DESKTOP_BAR_THICKNESS) / 2}px;
      }

      // .bars--vertical .track > *:not(.bar):not(.label) {
      //   display: none;
      // }

      .bars--vertical.bars--zoom-out .track {
        width: ${DESKTOP_BAR_SQUEEZED_THICKNESS}px;
      }

      .bars--vertical .notional-years {
        height: auto;
        width: 0;
        display: flex;
        align-items: flex-end;
        // outline: 1px solid purple;
        position: relative;
      }

      .bars--vertical .notional-year {
        margin: 0 0 0 ${DESKTOP_SQUEEZED_MARGIN}px;
        width: ${DESKTOP_BAR_SQUEEZED_THICKNESS}px;

        background: linear-gradient(to top, rgba(56, 71, 149, 0.4) 0%, rgba(56, 71, 149, 0) 98%);
      }

      .bars--vertical.bars--zoom-out .notional-years {
        width: auto;
      }

      .bars--vertical.bars--zoom-out .track {
        margin: 0 0 0 ${DESKTOP_SQUEEZED_MARGIN}px;
      }

      .bars--vertical .fiscal-cap-marker {
        border-left: 0;
        border-bottom: 4px solid black;
        width: ${DESKTOP_BAR_THICKNESS + 10}px;
        // outline: 1px solid blue;
        transition: opacity 0.05s ease-in, left 0.2s linear, width 0.2s linear,
          background-color 0.2s linear;
        top: auto;
        left: -5px;
        text-align: center;
        white-space: nowrap;
        text-indent: -7px; // fudge
        font-size: 15px;
        line-height: 30px;
      }

      .bars--vertical.bars--zoom-out .fiscal-cap-marker {
        width: ${DESKTOP_BAR_SQUEEZED_THICKNESS + 8}px;
        left: -4px;
      }

      .bars--vertical .ghost-bar {
        width: 100%;
        height: auto;
        top: auto;
        bottom: 0;
      }

      .bars--vertical .ghost-marker {
        width: 100%;
        height: 0;
        border-top: 1px dotted #999;
        border-bottom: 1px dotted #999;
        border-left: 0;
        border-right: 0;
      }

      .bars--vertical .well {
        top: auto;
        bottom: 0;
        width: 100%;
        box-shadow: inset 1px 1px 5px 0px rgba(0,0,0,0.175);

        // position: absolute;
        // height: 100%;
        // top: 0;
        // background: ${colours.darkBlue};
        // transition: width 0.25s ease-out, background 0.15s linear;
        //
        // background: #e1e0df;
        // opacity: 0;
        // transition: opacity 0.15s ease-in;
      }

      .bars--vertical .headroom-label {
        height: 100%;
        top: auto;
        width: 100px;
        left: ${(100 - DESKTOP_BAR_THICKNESS) * -0.5}px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .bars--vertical .headroom-label--small {
        font-size: 30px;
      }
    `}</style>
  </div>
);

Bars.defaultProps = { vertical: false, ghostMarkers: null, ghostBars: null };

export default Bars;
