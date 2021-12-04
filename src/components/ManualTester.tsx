import React, { useEffect, useState } from 'react';
import { runMONKE } from '../logic/algotithms/MONKE';
import { Graph } from '../logic/graph';
import { generateGraph } from '../logic/graphGenerator';
import { parseInput, Variable } from '../logic/plaintextParser';

import './ManualTester.scss';
import TestCaseTable from './TestCaseTable';
import UsageGuide from './UsageGuide';

interface GeneratedState {
  variables: Variable[];
  graph: Graph;
}

const generateState = (input: string) => {
  const [variables, testCases] = parseInput(input);

  const originalGraph = generateGraph(testCases);
  const graph = runMONKE(originalGraph);

  return {
    variables,
    graph,
  };
};

const ManualTester = () => {
  const [input, setInput] = useState(
    `
// This is a comment. It is editable.

VIP(bool); price(num); second_hand_price(num)
true;   <50; *
false; >=50; *
true;  >=50; *
*;      >30; >60
  `.trim(),
  );

  const [generatedState, setGeneratedState] = useState<
    GeneratedState | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpHidden, setIsHelpHidden] = useState(true);

  useEffect(() => {
    console.log('hmmm');
    if (isLoading) {
      try {
        const newGraphs = generateState(input);
        setGeneratedState(newGraphs);
      } catch (error) {
        alert(error);
        console.log(error);
      }
      setIsLoading(false);
    }
  }, [isLoading, input]);

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
            You can paste the requirements here, so you don't have to switch to other tabs.
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
          {!isLoading && generatedState !== undefined && (
            <TestCaseTable
              variables={generatedState.variables}
              graph={generatedState.graph}
            />
          )}
        </div>
      </div>
      <UsageGuide
        className={`usageContainer ${isHelpHidden ? 'hidden' : ''}`}
      />
    </>
  );
};

export default ManualTester;
