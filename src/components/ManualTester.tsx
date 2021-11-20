import React, { useCallback, useEffect, useState } from 'react';
import { runLeastLosingComponents } from '../logic/algotithms/leastLosingComponents';
import { runLeastLosingNodesReachable } from '../logic/algotithms/leastLosingNodesReachable';
import { runMONKE } from '../logic/algotithms/MONKE';
import { Graph } from '../logic/graph';
import { generateGraph, createGraphUrl } from '../logic/graphGenerator';
import { parseInput } from '../logic/plaintextParser';

interface Graphs {
  original: Graph;
  MONKE: Graph;
  leastComponents: Graph;
  leastNodes: Graph;
}

function generateGraphs(input: string) {
  const inputs = parseInput(input);
  const graph = generateGraph(inputs);

  const monkeGraph = runMONKE(graph);
  const leastLosingComponentsGraph = runLeastLosingComponents(graph);
  const leastLosingNodesGraph = runLeastLosingNodesReachable(graph);

  return {
    original: graph,
    MONKE: monkeGraph,
    leastComponents: leastLosingComponentsGraph,
    leastNodes: leastLosingNodesGraph,
  };
}

function ManualTester() {
  const [input, setInput] = useState(
    `
VIP(boolean);price(number,0.01);second_hand_price(number,0.01)
true;<50;*
false;>=50;*
true;>=50;*
*;>30;>60
  `.trim(),
  );

  const [graphs, setGraphs] = useState<Graphs>(() => generateGraphs(input));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      try {
        const newGraphs = generateGraphs(input);
        setGraphs(newGraphs);
      } catch (error) {
        alert(error);
        console.log(error);
      }
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={20}
        cols={80}
      ></textarea>
      <br />
      <button onClick={(_) => setIsLoading(true)}>Regenerate Graphs</button>
      <br />
      <br />
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          <p>
            Original graph nodes: {graphs.original.nodes.length}{' '}
            <a href={createGraphUrl(graphs.original)} target="_blank">
              link
            </a>
          </p>
          <p>
            MONKE graph nodes: {graphs.MONKE.nodes.length}{' '}
            <a href={createGraphUrl(graphs.MONKE)} target="_blank">
              link
            </a>
          </p>
          <p>
            Least Losing Component Count graph nodes:{' '}
            {graphs.leastComponents.nodes.length}{' '}
            <a href={createGraphUrl(graphs.leastComponents)} target="_blank">
              link
            </a>
          </p>
          <p>
            Least Losing Connected Nodes graph nodes:{' '}
            {graphs.leastNodes.nodes.length}{' '}
            <a href={createGraphUrl(graphs.leastNodes)} target="_blank">
              link
            </a>
          </p>
        </div>
      )}
      <div>
        <h2>Usage guide:</h2>
        <p>
          The first line should be the variable list, separated by semicolons{' '}
          <b>;</b>
        </p>
        <p>
          Be careful not to put whitespaces anywhere! Floating point numbers use
          a dot <b>.</b>
        </p>
        <p>
          One variable has this strucutre:
          <ul>
            <li>
              <code>variableName(boolean)</code>
            </li>
            <li>
              <code>variableName(number,0.02)</code>
              <br />
              where 0.02 is the number's precision.
            </li>
          </ul>
        </p>
        <p>
          From the second line on, the test cases are listed line by line.
          <br />
          The test cases are separated with a semicolon <b>;</b>
          <br />
          One test case can be:
          <ul>
            <li>
              *<br />
              if there is n constraint on this variable in this test case
            </li>
            <li>
              <code>true</code> or <code>false</code>
              <br />
              if the variable is boolean
            </li>
            <li>
              <code>&lt;30</code> or <code>!=12.62</code>
              <br />
              This consists of a uniry operator followed by a number. Unary
              operators: <code>&lt; &lt;= &gt; &gt;= = !=</code>
            </li>
            <li>
              <code>[-2,10.3]</code> or <code>[4,10)</code> or{' '}
              <code>(-2.2,10.3)</code>
              <br />
              Intervals have the following stucure:
              <ul>
                <li>
                  <code>(</code> or <code>[</code>
                </li>
                <li>number, lower boundary</li>
                <li>
                  <code>,</code>
                </li>
                <li>number, upper boundary</li>
                <li>
                  <code>]</code> or <code>)</code>
                </li>
              </ul>
            </li>
          </ul>
          Example: You want to write a test case for the following:{' '}
          <code>
            isVIP = true AND price in (100,199.99] AND discount &gt; 20
          </code>
          <br />
          It will be: <code>true;(100,199.99];&gt;20</code>
        </p>
        <p>
          Another, complete example:
          <pre>
            <code>
              age(number,1);service(number,1)
              <br />
              &lt;18;*
              <br />
              [18,45);&lt;15
              <br />
              [18,45);[15,30)
              <br />
              [18,45);&gt;=30
              <br />
              [45,60);&lt;30
              <br />
              &gt;=60;&lt;30
              <br />
              &gt;=60;&gt;=30
              <br />
            </code>
          </pre>
        </p>
      </div>
    </div>
  );
}

export default ManualTester;
