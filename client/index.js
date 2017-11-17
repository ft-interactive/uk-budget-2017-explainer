// @flow

import React from 'react';
import invariant from 'invariant';
import ReactDOM from 'react-dom';
import App from './components/App';
import getChartData from './getChartData';
import './styles.scss';

const chartData = getChartData();

const centralSection = document.querySelector('.explainer__central-section');
invariant(centralSection, 'Container must exist');

const copyHTML = centralSection.innerHTML;

centralSection.innerHTML = '';
centralSection.classList.add('explainer__central-section--ready');

ReactDOM.render(<App chartData={chartData} copyHTML={copyHTML} />, centralSection);
