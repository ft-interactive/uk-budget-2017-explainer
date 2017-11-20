// @flow

import React from 'react';
import classNames from 'class-names';

type TicksProps = {
  tickSize: number,
  extent: number,
  horizontal?: boolean,
};

const Ticks = ({ tickSize, extent, horizontal }: TicksProps) => (
  <div className={classNames('ticks', horizontal ? 'ticks--horizontal' : 'ticks--vertical')}>
    {Array.from({ length: Math.floor(extent / tickSize) + 1 }).map((v, i) => {
      const value = i * tickSize;

      const xOffsetPercent = value * (100 / extent);

      return (
        <div
          key={value}
          className="tick"
          style={{ [horizontal ? 'bottom' : 'left']: `${xOffsetPercent}%` }}
        >
          <div className="label">{value}</div>
        </div>
      );
    })}

    <style jsx>{`
      .ticks {
        position: absolute;
        height: 100%;
        width: 100%;
      }

      .tick {
        position: absolute;
      }

      .label {
        font-size: 14px;
        line-height: 14px;
        color: #595551;
      }

      // VERTICAL TICKS (MOBILE)
      .ticks--vertical .tick {
        height: 100%;
      }

      .ticks--vertical .tick:not(:first-child):after {
        content: '';
        display: block;
        height: 10px;
        width: 1px;
        position: absolute;
        background: gray;
        bottom: -14px;
      }

      .ticks--vertical .label {
        font-size: 14px;
        width: 40px;
        margin-left: -20px;
        text-align: center;
        position: absolute;
        bottom: -30px;
      }

      // HORIZONTAL TICKS (DESKTOP)
      .ticks--horizontal .tick {
        height: 1px;
        width: 100%;
        background: #ddd4c5;
      }

      .ticks--horizontal .label {
        position: absolute;
        right: -26px;
        top: -8px;
        font-size: 16px;
        line-height: 16px;
        width: 20px;
      }
    `}</style>
  </div>
);

Ticks.defaultProps = { horizontal: false };

export default Ticks;
