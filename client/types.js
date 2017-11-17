// @flow

export type Projection = Array<number>;

export type Scene = {
  heading: string,
  projectionId: string,
  showCap: boolean,
  highlightCap: boolean,
  zoomOut: boolean,
  highlightHeadroom: boolean,
};

export type ChartData = {
  scenes: {
    [name: string]: Scene,
  },

  barLabels: Array<string>,

  projections: {
    [id: string]: Projection,
  },
};
