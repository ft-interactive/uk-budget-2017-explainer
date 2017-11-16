// import React from 'react';
// import ReactDOM from 'react-dom';
import './styles.scss';
// import DeficitChart from './components/DeficitChart';

const chartContainerEl = document.querySelector('.deficit-chart');
const chartEl = chartContainerEl.querySelector('.deficit-chart__figure');

// const deficitChart = ReactDOM.render(<DeficitChart />, chartContainerEl);

const chartData = JSON.parse(chartContainerEl.getAttribute('data-chart-data'));
const initialSceneName = chartContainerEl.getAttribute('data-chart-initial-scene');

// grab all the 'set-scene' markers
const sceneChanges = [...document.querySelectorAll('[data-chart-set-scene]')].map(el => ({
  el,
  name: el.getAttribute('data-chart-set-scene'),
}));

const unstickMarker = document.querySelector('[data-marker=unstick]');

const setStuck = () => {
  chartEl.classList.add('deficit-chart__figure--stuck');
  chartEl.classList.remove('deficit-chart__figure--at-bottom');
  chartEl.style.top = null;
};

const setAtTopUnstuck = () => {
  chartEl.classList.remove('deficit-chart__figure--stuck');
  chartEl.classList.remove('deficit-chart__figure--at-bottom');
  chartEl.style.top = null;
};

const setAtBottomUnstuck = (offset) => {
  chartEl.classList.add('deficit-chart__figure--at-bottom');
  chartEl.classList.remove('deficit-chart__figure--stuck');
  chartEl.style.top = `${offset}px`;
};

/**
 * The function that updates the chart
 */
let currentSceneName = null;
const setChartScene = (newSceneName) => {
  if (newSceneName === currentSceneName) return;

  // change of scene!
  // console.log('TODO change scene from', currentSceneName, '==>', newSceneName);
  const scene = chartData.scenes.find(({ name }) => name === newSceneName);

  const sceneWithProjection = {
    ...scene,
    projection: chartData.projections.find(({ id }) => id === scene.projection),
  };

  chartEl.innerHTML = `<pre style-"overflow:hidden">${JSON.stringify(
    sceneWithProjection,
    null,
    2,
  )}</pre>`;

  // deficitChart.setState(scene);

  // chart.style.background = stringToColour(newSceneName);

  // note for next time
  currentSceneName = newSceneName;
};

const updateDisplay = () => {
  const isMobileLayout = innerWidth < 765;
  let stickyStatus; // 0 is top, 1 is middle, 2 is bottom

  const chartContainerBB = chartContainerEl.getBoundingClientRect();

  // stick or unstick the chart as appropriate
  {
    if (chartContainerBB.top < 0) {
      // we're under the point where the chart first sticks.
      // check we're not somewhere after the unstick marker...
      const unstickMarkerBB = unstickMarker.getBoundingClientRect();

      if (chartContainerBB.height - unstickMarkerBB.top > 0) {
        setAtBottomUnstuck(
          // eslint-disable-next-line no-mixed-operators
          unstickMarkerBB.top + scrollY - (chartContainerEl.offsetTop + chartContainerBB.height),
        );
        stickyStatus = 2;
      } else {
        setStuck();
        stickyStatus = 1;
      }
    } else {
      // we're somewhere near the top of the page; chart shouldn't be stuck here
      setAtTopUnstuck();
      stickyStatus = 0;
    }
  }

  // update the scene as appropriate
  {
    // find the bottom-most scene marker that's comfortably within view
    const tripwire = innerHeight - (chartContainerBB.height - 60);
    const withinViewport = sceneChanges
      .map(({ el, name }) => {
        if (el.getBoundingClientRect().bottom < tripwire) {
          return name;
        }
        return null;
      })
      .filter(x => x);

    const targetSceneName = withinViewport.length ? withinViewport.pop() : initialSceneName;

    setChartScene(targetSceneName);
  }
};

// update the display once at the start
updateDisplay();

// ...and again on every scroll and resize
window.addEventListener('scroll', updateDisplay);
window.addEventListener('resize', updateDisplay);

// HACK update display every quarter-second for the first few seconds, then every couple of seconds
// forever after, to fix any weirdness caused by ads or other stuff resizing themselves
{
  const initialUpdatesInterval = setInterval(updateDisplay, 250);
  setTimeout(() => {
    clearInterval(initialUpdatesInterval);
    setInterval(updateDisplay, 2000);
  }, 3000);
}
