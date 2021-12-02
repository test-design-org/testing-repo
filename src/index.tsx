import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGraphUrl, generateGraph } from './logic/graphGenerator';
import { runMONKE } from './logic/algotithms/MONKE';
import { numberOfConnectedComponentsComponents } from './logic/algotithms/common';
import { runLeastLosingComponents } from './logic/algotithms/leastLosingComponents';
import { runLeastLosingNodesReachable } from './logic/algotithms/leastLosingNodesReachable';
import { BookStore } from './logic/testCases';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
