import { div } from 'interval-arithmetic';
import React, { useCallback, useEffect, useState } from 'react';
import { runLeastLosingComponents } from '../logic/algotithms/leastLosingComponents';
import { runLeastLosingNodesReachable } from '../logic/algotithms/leastLosingNodesReachable';
import { runMONKE } from '../logic/algotithms/MONKE';
import { Graph } from '../logic/graph';
import { generateGraph, createGraphUrl } from '../logic/graphGenerator';
import { parseInput, Variable } from '../logic/plaintextParser';
import { generateTestValue } from '../logic/testValueGenerator';

import './ManualTester.scss';

interface Graphs {
  variables: Variable[];
  original: readonly [Graph, number];
  MONKE: readonly [Graph, number];
  // leastComponents: readonly [Graph, number];
  // leastNodes: readonly [Graph, number];
}

function generateGraphs(input: string) {
  const [variables, testCases] = parseInput(input);

  const beforeGraph = performance.now();
  const graph = generateGraph(testCases);
  const afterGraph = performance.now();

  const beforeMonkeGraph = performance.now();
  const monkeGraph = runMONKE(graph);
  const afterMonkeGraph = performance.now();

  // const beforeLCGraph = performance.now();
  // const leastLosingComponentsGraph = runLeastLosingComponents(graph);
  // const afterLCGraph = performance.now();

  // const beforeLNGraph = performance.now();
  // const leastLosingNodesGraph = runLeastLosingNodesReachable(graph);
  // const afterLNGraph = performance.now();

  return {
    variables,
    original: [graph, afterGraph - beforeGraph] as const,
    MONKE: [monkeGraph, afterMonkeGraph - beforeMonkeGraph] as const,
    // leastComponents: [
    //   leastLosingComponentsGraph,
    //   afterLCGraph - beforeLCGraph,
    // ] as const,
    // leastNodes: [leastLosingNodesGraph, afterLNGraph - beforeLNGraph] as const,
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
  const [isHelpHidden, setIsHelpHidden] = useState(true);
  const [showIntervalValues, setShowIntervalValues] = useState(true);

  useEffect(() => {
    console.log('hmmm');
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
    <>
      <div className="container">
        <div className="leftInput">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
          ></textarea>
          <button onClick={(_) => setIsLoading(true)} disabled={isLoading}>
            Regenerate Graphs
          </button>
        </div>
        <div className="rightOutput">
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <label htmlFor="showIntervalValues">
                <input
                  type="checkbox"
                  checked={showIntervalValues}
                  onChange={() => setShowIntervalValues((x) => !x)}
                  name="showIntervalValues"
                  id="showIntervalValues"
                />
                Show interval values
              </label>
              <table className="testValueTable">
                <thead>
                  <tr>
                    <th></th>
                    {graphs.variables.map((x) => (
                      <th>{x.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {graphs.MONKE[0].nodes.map((nNuple, index) => (
                    <tr>
                      <td>T{index + 1}</td>
                      {nNuple.list.map((x) => (
                        <td>{generateTestValue(x, showIntervalValues)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <div className="usageContainer">
        <h2>
          Usage guide
          <button
            onClick={() => setIsHelpHidden((x) => !x)}
            className="toggleButton"
          >
            {isHelpHidden ? 'Open' : 'Close'}
          </button>
        </h2>
        <div className={`usageText ${isHelpHidden ? 'hidden' : ''}`}>
          <p>
            The first line should be the variable list, separated by semicolons{' '}
            <b>;</b>
          </p>
          <p>
            Be careful not to put whitespaces anywhere! Floating point numbers
            use a dot <b>.</b>
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
                This consists of a uniry operator followed by a number. <br />
                Unary operators: <code>&lt; &lt;= &gt; &gt;= = !=</code>
              </li>
              <li>
                <code>[-2,10.3]</code> or <code>[4,10)</code> or{' '}
                <code>(-2.2,10.3)</code>
                <br />
                Intervals
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
                [18,60);&gt;=30
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
    </>
  );
}

export default ManualTester;
