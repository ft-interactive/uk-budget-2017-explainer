import './styles.scss';

const chartContainer = document.querySelector('.deficit-chart');
const chart = chartContainer.querySelector('.deficit-chart__figure');

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

const updateDisplay = () => {
  // stick or unstick the chart as appropriate
  {
    const chartContainerBB = chartContainer.getBoundingClientRect();

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
};

// update the display once at the start
updateDisplay();

// ...and again on every scroll and resize
window.addEventListener('scroll', updateDisplay);
window.addEventListener('scroll', updateDisplay);
