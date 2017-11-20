// @flow

import _ from 'lodash';
import React, { Component } from 'react';
import invariant from 'invariant';
import classNames from 'class-names';
import Chart from './Chart';
import Copy from './Copy';
import type { ChartData } from '../types';

const MOBILE_CHART_HEIGHT = 260;
const MIN_DESKTOP_CHART_HEIGHT = 300;
const MAX_DESKTOP_CHART_HEIGHT = 450;
const IDEAL_DESKTOP_CHART_HEIGHT_PROPORTION = 0.75; // proportion of viewport height

type AppProps = {
  copyHTML: string,
  chartData: ChartData,
};

type Measurements = {
  viewportWidth: number,
  viewportHeight: number,
  appWidth: number,
  appHeight: number,
};

type State = {
  mobileCollapsed: boolean,
  scrollY: number,
  measurements: Measurements,
  mode: 'mobile' | 'desktop',
  chartHeight: number,
  chartWidth: number,
  waypoints: Array<{
    name: string,
    scrollYThreshold: number,
  }>,
  stickinessStart: number,
  stickinessEnd: number,
  fixedChartYOffsetFromViewport: number,
  sceneName: string,
  live: boolean,
};

type WaypointsCache = Array<{ el: HTMLElement, name: string }>;

/**
 * Watches the window size and scroll position and updates the layout accordingly.
 */

export default class App extends Component<AppProps, State> {
  state: State = {
    mobileCollapsed: false,
    mode: 'mobile',
    scrollY: 0,
    measurements: {
      appWidth: 0,
      appHeight: 0,
      viewportWidth: 0,
      viewportHeight: 0,
    },
    waypoints: [],
    chartHeight: 0,
    chartWidth: 0,
    live: false,
    fixedChartYOffsetFromViewport: 0,
    sceneName: 'initial-projections',
    stickinessStart: 0,
    stickinessEnd: 0,
  };

  componentDidMount() {
    this.fullUpdate();

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    window.addEventListener('resize', () => {
      this.fullUpdate();
    });

    window.addEventListener('load', () => {
      this.fullUpdate();
    });

    // TODO enable this or something like it, maybe also check if foregrounded
    setInterval(() => {
      this.fullUpdate();
    }, 2000);
  }

  fullUpdate() {
    const appBox = this.element.getBoundingClientRect();

    const measurements = {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      appWidth: appBox.width,
      appHeight: appBox.height,
    };

    const mode = measurements.viewportWidth < 725 ? 'mobile' : 'desktop';

    const chartHeight =
      mode === 'desktop'
        ? _.clamp(
            measurements.viewportHeight * IDEAL_DESKTOP_CHART_HEIGHT_PROPORTION,
            MIN_DESKTOP_CHART_HEIGHT,
            MAX_DESKTOP_CHART_HEIGHT,
          )
        : MOBILE_CHART_HEIGHT;

    const chartWidth =
      mode === 'desktop' ? Math.min(measurements.appWidth / 2, 400) : measurements.appWidth;

    const fixedChartYOffsetFromViewport =
      mode === 'desktop' ? (measurements.viewportHeight - chartHeight) / 2 : 0;

    // determine the maximum scroll depth for each stickiness state
    const stickinessStart = this.element.offsetTop - fixedChartYOffsetFromViewport;
    const stickinessEnd =
      this.element.offsetTop + appBox.height - (chartHeight + fixedChartYOffsetFromViewport);

    const viewableTextHeight = measurements.viewportHeight - (mode === 'mobile' ? chartHeight : 0);

    // make an offset so the waypoint has to be about 1/3 of the way down the visible text
    const waypointOffset =
      mode === 'mobile'
        ? 0 - chartHeight + viewableTextHeight * (1 / -3)
        : viewableTextHeight * (1 / -2);

    // determine the maximum scroll depth for each waypoint
    const waypoints = (() => {
      // query for them [again] only if necessary
      let waypointsCache = this.waypointsCache;
      if (!waypointsCache || !waypointsCache.every(({ el }) => this.element.contains(el))) {
        waypointsCache = [
          ...this.element.querySelectorAll('.copy-container [data-chart-scene]'),
        ].map(el => ({
          el,
          name: el.getAttribute('data-chart-scene'),
        }));

        invariant(waypointsCache.every(({ el, name }) => el && name), 'OK');

        // $FlowFixMe
        this.waypointsCache = (waypointsCache: WaypointsCache);
      }

      return this.waypointsCache.map(({ el, name }) => ({
        name,
        scrollYThreshold: el.getBoundingClientRect().top + window.scrollY + waypointOffset,
      }));
    })();

    this.handleScroll({
      measurements,
      mode,
      stickinessStart,
      stickinessEnd,
      chartHeight,
      fixedChartYOffsetFromViewport,
      chartWidth,
      waypoints,
    });
  }

  handleScroll(extraState?: Object) {
    const state = {
      ...this.state,
      ...extraState,
      live: true,
    };

    state.scrollY = window.scrollY;

    state.sceneName = 'initial-projections';
    for (let i = state.waypoints.length - 1; i >= 0; i -= 1) {
      const waypoint = state.waypoints[i];
      if (waypoint.scrollYThreshold < state.scrollY) {
        state.sceneName = waypoint.name;
        break;
      }
    }

    this.setState(state);
  }

  props: AppProps;
  element: HTMLDivElement;
  waypointsCache: WaypointsCache;

  render() {
    const { copyHTML, chartData } = this.props;

    const {
      scrollY,
      mode,
      chartHeight,
      chartWidth,
      stickinessStart,
      stickinessEnd,
      fixedChartYOffsetFromViewport,
      sceneName,
      live,
      mobileCollapsed,
    } = this.state;

    let stickyStatus;
    if (scrollY < stickinessStart) {
      stickyStatus = 'top';
    } else if (scrollY > stickinessEnd) {
      stickyStatus = 'bottom';
    } else {
      stickyStatus = 'middle';
    }

    const collapsed = mode === 'mobile' && stickyStatus !== 'top' && mobileCollapsed;

    return (
      <div
        className={classNames('app', `app--${mode}`)}
        ref={(el) => {
          if (el) this.element = el;
        }}
      >
        <div className="graphic-space-reserver" style={{ height: `${chartHeight}px` }}>
          <div
            className={classNames(
              'graphic',
              stickyStatus === 'top' && 'graphic--at-top',
              stickyStatus === 'middle' && 'graphic--stuck',
              stickyStatus === 'bottom' && 'graphic--at-bottom',
            )}
            style={{
              // height: `${graphicContainerHeight}px`,
              height: collapsed ? '50px' : `${chartHeight}px`,
              width: `${chartWidth}px`,
              top: stickyStatus === 'middle' ? `${fixedChartYOffsetFromViewport}px` : '',
              display: stickyStatus === 'bottom' && collapsed ? 'none' : '',
            }}
          >
            {live && (
              <Chart
                sceneName={sceneName}
                mode={mode}
                width={chartWidth}
                height={chartHeight}
                chartData={chartData}
                collapsed={collapsed}
                onCollapseToggle={() => {
                  this.setState({
                    ...this.state,
                    mobileCollapsed: !this.state.mobileCollapsed,
                  });
                }}
                showCollapseButton={mode === 'mobile' && stickyStatus !== 'top'}
              />
            )}
          </div>
        </div>

        <div className="copy-container o-typography-body">
          <Copy copyHTML={copyHTML} />
        </div>

        <style jsx>{`
          .app {
            box-sizing: border-box;
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
          }

          .app :global(*),
          .app :global(*:before),
          .app :global(*:after) {
            box-sizing: inherit;
          }

          .graphic {
            // just for some mobile browsers that support it. we are fixing the position manually with the stuck class anyway, but sometimes slow devices would not render in time, so the chart would be temporarily off the screen.
            position: sticky;
            top: 0;
            bottom: 0;
            overflow: hidden;
          }

          .graphic--stuck {
            position: fixed;
            overflow: visible;
          }

          .graphic--at-bottom {
            position: absolute;
            bottom: 0;
            top: auto;
          }

          .app--mobile .graphic {
            background: #fff1e5;
            transition: background-color 0.1s linear, box-shadow 0.05s linear;
          }

          .app--mobile .graphic--stuck {
            background: white;
            box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.2);
            transition: background-color 0.5s ease-in, box-shadow 0.25s linear;
          }

          .copy-container {
            padding: 20px 10px 0;
          }

          @media (min-width: 725px) {
            .copy-container {
              padding-top: 0;
            }
            .copy-container {
              margin-top: -15px;
              margin-bottom: -25px;
            }

            .app {
              margin-bottom: 40px;
            }
          }

          // TODO maybe highlight these?
          .copy-container :global([data-chart-scene]) {
            // font-weight: bold;
            // border-bottom: 2px solid #1262b3;
            // background: hsla(210, 100%, 80%, 0.4);
          }

          .app--desktop {
            display: flex;
            flex-direction: row-reverse;
          }

          .app--desktop .copy-container {
            width: 50%;
            max-width: 450px;
            padding: 0 20px;
            margin-left: auto;
          }

          .copy-container :global(hr) {
            margin: 90px 0;
            width: 80px;
            background: black;
            height: 6px;
            border: 0;

            // font: 400 20px MetricWeb, sans-serif;
            // text-transform: uppercase;
          }

          .graphic-space-reserver {
            cursor: default;
          }

          .app--desktop .graphic-space-reserver {
            width: 50%;
          }
        `}</style>
      </div>
    );
  }
}
