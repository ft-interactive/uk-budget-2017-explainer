// @flow

import invariant from 'invariant';
import type { Projection, ProjectionsLookup, ChartData, Scene, ScenesLookup } from './types';

/**
 * Grabs Bertha data from a known data attribute on the DOM, cleans it up, and returns it.
 */

const getChartData = (): ChartData => {
  const container = document.querySelector('[data-chart-data]');
  invariant(container, 'Element must exist');

  const json = container.getAttribute('data-chart-data');
  invariant(json, 'Element must have JSON data');

  const parsed = JSON.parse(json);

  // make an array of the values for 'notional' mid-twenties years (not to be displayed with any
  // precision)
  const notionalYears = String(parsed.options.midTwentiesBars)
    .split(',')
    .slice(0, 3)
    .map(x => Number(x.trim()));

  // make an object of projections
  const projections: ProjectionsLookup = parsed.projections.reduce((acc, p) => {
    const projection: Projection = ['y2017', 'y2018', 'y2019', 'y2020', 'y2021'].map(yearId => ({
      yearId,
      value: p[yearId],
    }));

    acc[p.id] = projection;

    return acc;
  }, {});

  // make scenes lookup
  const scenes: ScenesLookup = parsed.scenes.reduce((acc, s) => {
    let ghostMarkers = null;
    if (s.ghostmarkers) {
      ghostMarkers = projections[s.ghostmarkers];

      if (!ghostMarkers) {
        throw new Error(`Unknown projectionId in ghostmarkers field: ${s.ghostmarkers}`);
      }
    }

    let ghostBars = null;
    if (s.ghostbars) {
      ghostBars = projections[s.ghostbars];

      if (!ghostBars) {
        throw new Error(`Unknown projectionId in ghostbars field: ${s.ghostbars}`);
      }
    }

    const scene: Scene = {
      heading: s.heading,
      projectionId: s.projection,
      showCap: Boolean(s.showcap),
      highlightCap: Boolean(s.highlightcap),
      zoomOut: Boolean(s.zoomout),
      highlightHeadroom: Boolean(s.highlightheadroom),
      ghostMarkers,
      ghostBars,
    };

    acc[s.name] = scene;

    return acc;
  }, {});

  return {
    projections,
    scenes,
    barLabels: ['2017–18', '2018–19', '2019–20', '2020–21', '2021-22'],
    fiscalCap: Number(parsed.options.fiscalCap),
    notionalYears,
  };
};

export default getChartData;
