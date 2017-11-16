// @flow

import React from 'react';
import invariant from 'invariant';
import ReactDOM from 'react-dom';
import './styles.scss';
import ChartContainer from './components/ChartContainer';

const chartContainerEl = document.querySelector('.deficit-chart');
invariant(chartContainerEl, 'Element must exist');
const chartEl = chartContainerEl.querySelector('.deficit-chart__figure');
invariant(chartEl, 'Element must exist');

// make a new empty div to use as a React root
const reactRoot = document.createElement('div');
chartEl.innerHTML = '';
chartEl.appendChild(reactRoot);

const initialSceneName = chartContainerEl.getAttribute('data-chart-initial-scene');
invariant(initialSceneName, 'Required data attribute');

// ReactDOM.render(
//   <ChartContainer sceneName={initialSceneName} mode={isMobileLayout() ? 'mobile' : 'desktop'} availableWidth={10} />,
//   reactRoot,
// );

// grab all the 'set-scene' markers from the body text...
const sceneChanges = [...document.querySelectorAll('[data-chart-set-scene]')].map(el => ({
  el,
  name: el.getAttribute('data-chart-set-scene'),
}));

const unstickMarker = document.querySelector('[data-marker=unstick]');
invariant(unstickMarker, 'must exist');

const setStuck = () => {
  chartEl.classList.add('deficit-chart__figure--stuck');
  chartEl.classList.remove('deficit-chart__figure--at-bottom');
  chartEl.style.top = '';
};

const setAtTopUnstuck = () => {
  chartEl.classList.remove('deficit-chart__figure--stuck');
  chartEl.classList.remove('deficit-chart__figure--at-bottom');
  chartEl.style.top = '';
};

const setAtBottomUnstuck = (offset) => {
  chartEl.classList.add('deficit-chart__figure--at-bottom');
  chartEl.classList.remove('deficit-chart__figure--stuck');
  chartEl.style.top = `${offset}px`;
};

/**
 * The function that updates the chart
 */
// let currentSceneName = null;
// const setChartScene = (newSceneName) => {
//   if (newSceneName === currentSceneName) return;
//
//   //
//   // chartEl.innerHTML = `<pre style-"overflow:hidden">${JSON.stringify(
//   //   sceneWithProjection,
//   //   null,
//   //   2,
//   // )}</pre>`;
//
//   // chart.style.background = stringToColour(newSceneName);
//
//   // note for next time
//   currentSceneName = newSceneName;
// };

const updateDisplay = () => {
  // let stickyStatus; // 0 is top, 1 is middle, 2 is bottom

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
        // stickyStatus = 2;
      } else {
        setStuck();
        // stickyStatus = 1;
      }
    } else {
      // we're somewhere near the top of the page; chart shouldn't be stuck here
      setAtTopUnstuck();
      // stickyStatus = 0;
    }
  }

  // update the scene as appropriate
  const targetSceneName: string = (() => {
    // find the bottom-most scene marker that's comfortably within view
    const tripwire = window.innerHeight - (chartContainerBB.height - 60);
    const withinViewport = sceneChanges
      .map(({ el, name }) => {
        if (el.getBoundingClientRect().bottom < tripwire) {
          return name;
        }
        return null;
      })
      .filter(x => x);

    invariant(withinViewport.every(x => typeof x === 'string'), 'must be all strings here');

    const returnValue = withinViewport.length ? withinViewport.pop() : initialSceneName;
    invariant(typeof returnValue === 'string', 'must be a string');
    return returnValue;
  })();

  ReactDOM.render(
    <ChartContainer
      sceneName={targetSceneName}
      mode={window.innerWidth < 740 ? 'mobile' : 'desktop'}
      availableWidth={chartContainerBB.width} // TODO
      availableHeight={chartContainerBB.height} // TODO
    />,
    reactRoot,
  );
};

// update the display once at the start
try {
  updateDisplay();
} catch (error) {
  console.error(error);
}

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
