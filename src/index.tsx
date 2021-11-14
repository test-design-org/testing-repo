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

// const a = generateTestCases([
//   new IntervalDTO(Expression.LessThan, new Interval(-Infinity, 3), 1, { lo: true, hi: true }),
//   new IntervalDTO(Expression.EqualTo, new Interval(5, 5), 1),
// ]);

// console.log(a.toString());
// console.log(a);
// const b = IOps.difference(new Interval(0,10), new Interval(5))
// const c = IOps.intersection(new Interval(1,7), b)
// console.log(b, c)

// const graph = generateGraph([
//   [
//     new IntervalDTO(Expression.LessThan, new Interval(-Infinity, 3), 1, {
//       lo: true,
//       hi: true,
//     }),
//     new IntervalDTO(Expression.EqualTo, new Interval(5, 5), 1),
//   ],
//   [
//     new IntervalDTO(Expression.LessThan, new Interval(-Infinity, 2), 1, {
//       lo: true,
//       hi: true,
//     }),
//     new MissingVariableDTO(),
//   ],
// ]);



const graph = generateGraph(BookStore);

const monkeGraph = runMONKE(graph);
const leastLosingComponentsGraph = runLeastLosingComponents(graph);
const leastLosingNodesGraph = runLeastLosingNodesReachable(graph);

console.log("OG graph", numberOfConnectedComponentsComponents(graph), graph.nodes.length, createGraphUrl(graph));
console.log("MONKE graph", numberOfConnectedComponentsComponents(monkeGraph), monkeGraph.nodes.length, createGraphUrl(monkeGraph));
console.log("Least Losing: Components graph", numberOfConnectedComponentsComponents(leastLosingComponentsGraph), 
  leastLosingComponentsGraph.nodes.length, createGraphUrl(leastLosingComponentsGraph));
console.log("Least Losing: Nodes reachable graph", numberOfConnectedComponentsComponents(leastLosingNodesGraph), 
  leastLosingNodesGraph.nodes.length, createGraphUrl(leastLosingNodesGraph));
