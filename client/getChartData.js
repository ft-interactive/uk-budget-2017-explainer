// @flow

import invariant from 'invariant';
import type { ChartData, Scene } from './types';

/**
 * Grabs Bertha data from a known data attribute on the DOM, cleans it up, and returns it.
 */

const getChartData = (): ChartData => {
  const container = document.querySelector('[data-chart-data]');
  invariant(container, 'Element must exist');

  const json = container.getAttribute('data-chart-data');
  invariant(json, 'Element must have JSON data');

  const parsed = JSON.parse(json);

  const projections = parsed.projections.reduce((acc, p) => {
    acc[p.id] = ([p.y2017, p.y2018, p.y2019, p.y2020, p.y2021]: number[]);
    return acc;
  }, {});

  const scenes = parsed.scenes.reduce((acc, s) => {
    let ghostMarkers = null;
    if (s.ghostmarkers) {
      ghostMarkers = projections[s.ghostmarkers];

      if (!ghostMarkers) {
        throw new Error(`Unknown projectionId in ghostmarkers field: ${s.ghostmakers}`);
      }
    }

    let ghostBars = null;
    if (s.ghostbars) {
      ghostBars = projections[s.ghostbars];

      if (!ghostBars) {
        throw new Error(`Unknown projectionId in ghostbars field: ${s.ghostmakers}`);
      }
    }

    acc[s.name] = ({
      heading: s.heading,
      projectionId: s.projection,
      showCap: Boolean(s.showcap),
      highlightCap: Boolean(s.highlightcap),
      zoomOut: Boolean(s.zoomout),
      highlightHeadroom: Boolean(s.highlightheadroom),
      ghostMarkers,
      ghostBars,
    }: Scene);

    return acc;
  }, {});

  const chartData: ChartData = {
    projections,
    scenes,
    barLabels: ['2017–18', '2018–19', '2019–20', '2020–21', '2021-22'],
    fiscalCap: parsed.options.fiscalCap,
  };

  return chartData;
};

export default getChartData;
