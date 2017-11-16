// @flow

import React, { Component } from 'react';
import MobileChart from './MobileChart';
import getChartData from '../getChartData';

type Props = {
  sceneName: string,
  mode: 'mobile' | 'desktop',
  availableWidth: number,
  availableHeight: number,
};

const chartData = getChartData();

export default class ChartContainer extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    // simple shallow comparison
    return Object.keys(nextProps).some(key => this.props[key] !== nextProps[key]);
  }

  props: Props;

  render() {
    const { sceneName, mode, availableWidth, availableHeight } = this.props;

    const scene = chartData.scenes[sceneName];
    const projection = chartData.projections[scene.projectionId];

    console.log('projection', projection);

    switch (mode) {
      case 'mobile':
        return (
          <MobileChart
            heading={scene.heading}
            width={availableWidth}
            height={availableHeight}
            // values={projection}
            // showCap={scene.showCap}
          />
        );
      case 'desktop':
        throw new Error('Not implemented');
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  }
}
