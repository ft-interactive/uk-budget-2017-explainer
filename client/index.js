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
};

const setAtTopUnstuck = () => {
  chartEl.classList.remove('deficit-chart__figure--stuck');
  chartEl.classList.remove('deficit-chart__figure--at-bottom');
  chartEl.style.top = '';
};

const setAtBottomUnstuck = () => {
  chartEl.classList.add('deficit-chart__figure--at-bottom');
  chartEl.classList.remove('deficit-chart__figure--stuck');
};

const setChartTop = (offset: number) => {
  // console.log('setting top', offset);
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
  let stickyStatus;
  const isMobile = window.innerWidth < 740;

  const chartContainerBB = chartContainerEl.getBoundingClientRect();

  // stick or unstick the chart as appropriate
  {
    const startStickingAt = isMobile ? 0 : 200;

    if (chartContainerBB.top <= startStickingAt) {
      // we're under the point where the chart first sticks.
      // check we're not somewhere after the unstick marker...
      const unstickMarkerBB = unstickMarker.getBoundingClientRect();

      if (chartContainerBB.height - unstickMarkerBB.top > 0 - startStickingAt) {
        if (stickyStatus !== 'at-bottom') {
          stickyStatus = 'at-bottom';
          setAtBottomUnstuck();
        }

        /* eslint-disable no-mixed-operators */
        if (isMobile) {
          // keeping this separate because I know it works
          setChartTop(
            unstickMarkerBB.top +
              window.scrollY -
              (chartContainerEl.offsetTop + chartContainerBB.height),
          );
        } else {
          const newViewportOffset =
            unstickMarkerBB.top - (chartContainerBB.height + chartContainerEl.offsetTop);

          const newTop = window.scrollY - window.innerHeight + newViewportOffset;

          // const newTop =
          //   unstickMarkerBB.top +
          //   window.scrollY -
          //   (chartContainerEl.offsetTop + chartContainerBB.height) -
          //   window.innerHeight;
          // console.log(newTop);

          setChartTop(newTop);
        }
        /* eslint-enable no-mixed-operators */
      } else {
        // if (!isMobile) {
        // }
        setChartTop(startStickingAt);

        if (stickyStatus !== 'stuck') {
          stickyStatus = 'stuck';
          // if (isMobile) setChartTop(0);
          setStuck();
        }
      }
    } else if (stickyStatus !== 'at-top') {
      // we're somewhere near the top of the page; chart shouldn't be stuck here
      stickyStatus = 'at-top';
      setAtTopUnstuck();
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
      mode={isMobile ? 'mobile' : 'desktop'}
      availableWidth={chartContainerBB.width}
      availableHeight={chartContainerBB.height}
      stickyStatus={stickyStatus} // TODO use this for styling, or remove it
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
