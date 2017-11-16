// @flow

import React, { Component, PureComponent } from 'react';
import classNames from 'class-names';
import type { ChartData } from '../types';

type CopyProps = { copyHTML: string };

class Copy extends PureComponent<CopyProps> {
  render() {
    const { copyHTML } = this.props;
    console.log('rendering copy container');

    // eslint-disable-next-line react/no-danger
    return <div className="copy" dangerouslySetInnerHTML={{ __html: copyHTML }} />;
  }
}

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
  scrollY: number,
  measurements: Measurements,
  mode: 'mobile' | 'desktop',
};

export default class App extends Component<AppProps, State> {
  state = {
    mode: 'mobile',
    scrollY: 0,
    measurements: {
      appWidth: 0,
      appHeight: 0,
      viewportWidth: 0,
      viewportHeight: 0,
    },
  };

  componentDidMount() {
    // grab waypoints
    const waypoints = [...this.element.querySelectorAll('.copy-container [data-chart-scene]')].map(
      el => ({
        el,
        name: el.getAttribute('data-chart-scene'),
      }),
    );

    console.log('waypoints', waypoints);

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    window.addEventListener('resize', () => {
      this.fullUpdate();
    });

    this.fullUpdate();

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

    const chartHeight = mode === 'desktop' ? 400 : 280;

    const chartWidth = mode === 'desktop' ? measurements.appWidth / 2 : measurements.appWidth;

    const fixedChartYOffsetFromViewport =
      mode === 'desktop' ? (measurements.viewportHeight - chartHeight) / 2 : 0;

    // determine the maximum scroll depth for each stickiness state
    const stickinessStart = this.element.offsetTop - fixedChartYOffsetFromViewport;
    const stickinessEnd =
      this.element.offsetTop + appBox.height - (chartHeight + fixedChartYOffsetFromViewport);

    // TODO measure the maximum scroll depth for each waypoint

    this.handleScroll({
      measurements,
      mode,
      stickinessStart,
      stickinessEnd,
      chartHeight,
      fixedChartYOffsetFromViewport,
      chartWidth,
    });
  }

  handleScroll(extraState?: Object) {
    const state = { ...this.state, ...extraState };
    state.scrollY = window.scrollY;
    this.setState(state);
  }

  props: AppProps;
  element: HTMLDivElement;

  // waypoints: {
  //   sceneName: string,
  //   yScroll: number,
  // };

  // measurements: Measurements;
  // mode: 'mobile' | 'desktop';

  render() {
    const { copyHTML, chartData } = this.props;
    const {
      measurements,
      scrollY,
      mode,
      chartHeight,
      chartWidth,
      stickinessStart,
      stickinessEnd,
      fixedChartYOffsetFromViewport,
    } = this.state;

    let which;
    if (scrollY < stickinessStart) {
      which = 'top';
    } else if (scrollY > stickinessEnd) {
      which = 'bottom';
    } else {
      which = 'middle';
    }

    return (
      <div
        className={classNames('app', `app--${mode}`)}
        ref={(el) => {
          if (el) this.element = el;
        }}
      >
        <div className="chart-container">
          <div
            className={classNames(
              'chart',
              which === 'middle' && 'chart--stuck',
              which === 'bottom' && 'chart--at-bottom',
            )}
          >
            <pre style={{ margin: '0' }}>{`
              asdf

              asdfasdf

              asdfasdf

              asdfadsf

              asdfasdf
              `}</pre>
          </div>
        </div>

        <div className="copy-container">
          <Copy copyHTML={copyHTML} />
        </div>

        <style jsx>{`
          .app {
            // padding-top: 10px;
            outline: 1px solid blue;
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

          .chart-container {
            height: ${chartHeight}px;
          }

          .chart {
            height: ${chartHeight}px;
            width: ${chartWidth}px;
          }

          .chart--stuck {
            position: fixed;
            top: ${fixedChartYOffsetFromViewport}px;
          }

          .chart--at-bottom {
            position: absolute;
            bottom: 0;
          }

          .app--mobile .chart {
            background: #fff1e5;
            transition: background-color 0.5s linear, box-shadow 0.25s linear;
          }
          .app--mobile .chart--stuck {
            background: white;
            box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.2);
          }

          .copy-container {
            padding: 20px 10px 0;
          }

          .app--desktop {
            display: flex;
            flex-direction: row-reverse;
          }

          .app--desktop .copy-container {
            width: 50%;
            padding: 0 20px;
          }

          .app--desktop .chart-container {
            width: 50%;
          }
        `}</style>
      </div>
    );
  }
}
