// @flow

export type Projection = Array<{
  yearId: string,
  value: number,
}>;

export type ProjectionsLookup = { [projectionId: string]: Projection };

export type Scene = {
  heading: string,
  projectionId: string,
  showCap: boolean,
  highlightCap: boolean,
  zoomOut: boolean,
  highlightHeadroom: boolean,
  ghostMarkers: null | Projection,
  ghostBars: null | Projection,
};

export type ScenesLookup = {
  [name: string]: Scene,
};

/**
 * Cleaned-up Bertha data. Should be treated as Immutable.
 */
export type ChartData = {
  scenes: ScenesLookup,

  barLabels: string[],

  projections: ProjectionsLookup,

  fiscalCap: number,

  notionalYears: number[],
};

/**
 * The props accepted by both the MobileChart and DesktopChart components.
 */
export type ChartProps = {
  heading: string,
  height: number,
  width: number,
  projection: Projection,
  barLabels: string[],
  showCap: boolean,
  highlightCap: boolean,
  zoomOut: boolean,
  fiscalCap: number,
  ghostMarkers: null | Projection,
  ghostBars: null | Projection,
  notionalYears: number[],
};
