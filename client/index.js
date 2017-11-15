import './styles.scss';

// const stringToColour = (str) => {
//   let hash = 0;
//   for (var i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let colour = '#';
//   for (var i = 0; i < 3; i++) {
//     const value = (hash >> (i * 8)) & 0xff;
//     colour += `00${value.toString(16)}`.substr(-2);
//   }
//   return colour;
// };

const chartContainer = document.querySelector('.deficit-chart');
const chart = chartContainer.querySelector('.deficit-chart__figure');

const chartData = JSON.parse(chartContainer.getAttribute('data-chart-data'));
const initialSceneName = chartContainer.getAttribute('data-chart-initial-scene');

// grab all the 'set-scene' markers
const sceneChanges = [...document.querySelectorAll('[data-chart-set-scene]')].map(el => ({
  el,
  name: el.getAttribute('data-chart-set-scene'),
}));

const unstickMarker = document.querySelector('[data-marker=unstick]');

const setStuck = () => {
  chart.classList.add('deficit-chart__figure--stuck');
  chart.classList.remove('deficit-chart__figure--at-bottom');
  chart.style.top = null;
};

const setAtTopUnstuck = () => {
  chart.classList.remove('deficit-chart__figure--stuck');
  chart.classList.remove('deficit-chart__figure--at-bottom');
  chart.style.top = null;
};

const setAtBottomUnstuck = (offset) => {
  chart.classList.add('deficit-chart__figure--at-bottom');
  chart.classList.remove('deficit-chart__figure--stuck');
  chart.style.top = `${offset}px`;
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

  chart.innerHTML = `<pre style-"overflow:hidden">${JSON.stringify(
    sceneWithProjection,
    null,
    2,
  )}</pre>`;

  // chart.style.background = stringToColour(newSceneName);

  // note for next time
  currentSceneName = newSceneName;
};

const updateDisplay = () => {
  const chartContainerBB = chartContainer.getBoundingClientRect();

  // stick or unstick the chart as appropriate
  {
    if (chartContainerBB.top < 0) {
      // we're under the point where the chart first sticks.
      // check we're not somewhere after the unstick marker...
      const unstickMarkerBB = unstickMarker.getBoundingClientRect();

      if (chartContainerBB.height - unstickMarkerBB.top > 0) {
        setAtBottomUnstuck(
          unstickMarker.offsetTop - chartContainer.offsetTop - chartContainerBB.height,
        );
      } else {
        setStuck();
      }
    } else {
      // we're somewhere near the top of the page; chart shouldn't be stuck here
      setAtTopUnstuck();
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
