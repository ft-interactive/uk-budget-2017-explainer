// @flow

import React, { PureComponent } from 'react';
import MobileChart from './MobileChart';
import DesktopChart from './DesktopChart';
import type { ChartData } from '../types';

type Props = {
  sceneName: string,
  mode: 'mobile' | 'desktop',
  availableWidth: number,
  availableHeight: number,
  chartData: ChartData,
};

/**
 * Wrapper whose job is to select between one or the other component. Also prevents unnecessary
 * re-rendering, by extending PureComponent.
 */

export default class Chart extends PureComponent<Props> {
  props: Props;

  render() {
    const { chartData, sceneName, mode, availableWidth, availableHeight } = this.props;

    const scene = chartData.scenes[sceneName];
    if (!scene) throw new Error(`Unknown scene: ${sceneName}`);

    const projection = chartData.projections[scene.projectionId];

    switch (mode) {
      case 'mobile':
        return (
          <MobileChart
            heading={scene.heading}
            width={availableWidth}
            height={availableHeight}
            projection={projection}
            barLabels={chartData.barLabels}
            showCap={scene.showCap}
          />
        );
      case 'desktop':
        return (
          <DesktopChart width={availableWidth} height={availableHeight} heading={scene.heading} />
        );
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  }
}
