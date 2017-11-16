// @flow

import invariant from 'invariant';
import type { ChartData, Scene, Projection } from './types';

/**
 * Grabs Bertha data from a known data attribute on the DOM, cleans it up, and returns it.
 */

const getChartData = (): ChartData => {
  const container = document.querySelector('[data-chart-data]');
  invariant(container, 'Element must exist');

  const json = container.getAttribute('data-chart-data');
  invariant(json, 'Element must have JSON data');

  const parsed = JSON.parse(json);

  const chartData = {
    scenes: parsed.scenes.reduce((acc, s) => {
      acc[s.name] = ({
        heading: s.heading,
        projectionId: s.projection,
        showCap: s.showcap,
        pulseCap: s.pulsecap,
        zoomOut: s.zoomout,
        highlightHeadroom: s.highlightheadroom,
      }: Scene);

      return acc;
    }, {}),

    barLabels: ['Years 2017–18', '2018–19', '2019–20', '2020–21', '2021-22'],

    projections: parsed.projections.reduce((acc, p) => {
      acc[p.id] = ([p.y2017, p.y2018, p.y2019, p.y2020, p.y2021]: Projection);
      return acc;
    }, {}),
  };

  return chartData;
};

export default getChartData;
