// @flow

export type Scene = {
  heading: string,
  projectionId: string,
  showCap: boolean,
  highlightCap: boolean,
  zoomOut: boolean,
  highlightHeadroom: boolean,
  ghostMarkers: null | number[],
  ghostBars: null | number[],
};

/**
 * Cleaned-up Bertha data. Should be treated as Immutable.
 */
export type ChartData = {
  scenes: {
    [name: string]: Scene,
  },

  barLabels: string[],

  projections: {
    [id: string]: number[],
  },

  fiscalCap: number,
};

/**
 * The props accepted by both the MobileChart and DesktopChart components.
 */
export type ChartProps = {
  heading: string,
  height: number,
  width: number,
  projection: number[],
  barLabels: string[],
  showCap: boolean,
  highlightCap: boolean,
  zoomOut: boolean,
  fiscalCap: number,
  ghostMarkers: null | number[],
  ghostBars: null | number[],
};
