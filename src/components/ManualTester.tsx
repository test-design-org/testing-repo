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
// This is an example. You should replace this with your own test description.

VIP(bool); price(num); second_hand_price(num)
true;   <50; *
false; >=50; *
true;  >=50; *
*;      >30; >60
  `.trim(),
  );

  const [graphs, setGraphs] = useState<Graphs | undefined>(undefined);
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
          <h2>General predicate test description</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
          ></textarea>
          <h2>Requirements</h2>
          <textarea rows={10}>
            Paste your requirements into this textarea, so you don't have to
            switch to other tabs in your browser to write yours test
            descriptions up above.
          </textarea>
          <div className="buttons">
            <button onClick={(_) => setIsLoading(true)} disabled={isLoading}>
              Generate Tests
            </button>
            <button
              onClick={() => setIsHelpHidden((x) => !x)}
              className="toggleButton"
            >
              {isHelpHidden ? 'Open' : 'Close'} user guide
            </button>
          </div>
        </div>
        <div className="rightOutput">
          {!isLoading && graphs !== undefined && (
            <>
              <h2>Generated test cases</h2>
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
      <div className={`usageContainer ${isHelpHidden ? 'hidden' : ''}`}>
        <h2>Usage guide</h2>
        <div>
          <p>
            The first line should be the variable list, separated by semicolons{' '}
            <b>;</b>
            <br />
            You can only put whitespace between expressions (before or after
            semicolons, beginning or end of a line), but not in the middle of
            expressions!
          </p>
          <p>
            Floating point numbers use a dot <b>.</b>
          </p>
          <p>
            You can leave lines empty, or create a whole commented line by
            starting it with <code>//</code>
          </p>
          <p>
            One variable has this strucutre:
            <ul>
              <li>
                <code>variableName(bool)</code>
                <br />
                Boolean
              </li>
              <li>
                <code>variableName(int)</code>
                <br />
                Integer
              </li>
              <li>
                <code>variableName(num)</code>
                <br />
                Number, where the precision defaults to 0.01
              </li>
              <li>
                <code>variableName(num,0.02)</code>
                <br />
                Number, where the precision is 0.02
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
                if there is no constraint on this variable in this test case
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
            Example: You want to write a test case for the following:
            <br />
            <code>
              IF isVIP = true AND price &gt; 100 AND price &lt;= 199.99 AND
              discount &gt; 20
            </code>
            <br />
            It will be: <code>true; (100,199.99]; &gt;20</code>
          </p>
          <p>
            Another, complete example:
            <pre>
              <code>
                // Vacation example from
                https://exercises.test-design.org/paid-vacation-days/
                <br />
                age(int); service(int)
                <br />
                &lt;18; *
                <br />
                [18,45); &lt;15
                <br />
                [18,45); [15,30)
                <br />
                [18,60); &gt;=30
                <br />
                [45,60); &lt;30
                <br />
                &gt;=60; &lt;30
                <br />
                &gt;=60; &gt;=30
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
