// @flow

import React, { PureComponent } from 'react';
import MobileChart from './MobileChart';
import DesktopChart from './DesktopChart';
import type { ChartData } from '../../types';

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

    const childProps = {
      heading: scene.heading,
      width: availableWidth,
      height: availableHeight,
      projection,
      barLabels: chartData.barLabels,
      showCap: scene.showCap,
      highlightCap: scene.highlightCap,
      zoomOut: scene.zoomOut,
      fiscalCap: chartData.fiscalCap,
      ghostMarkers: scene.ghostMarkers,
    };

    switch (mode) {
      case 'mobile':
        return <MobileChart {...childProps} />;
      case 'desktop':
        return <DesktopChart {...childProps} />;
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  }
}
