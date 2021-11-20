import React, { useCallback, useState } from 'react';
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

  const regenerateGraphs = useCallback(() => {
    setIsLoading(true);
    console.log(isLoading);
    const newGraphs = generateGraphs(input);
    setGraphs(newGraphs);
    setIsLoading(false);
    console.log(isLoading);
  }, [setIsLoading, setGraphs, input, isLoading]);

  return (
    <>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      {isLoading ? 'loading...' : 'Loaded'}
      {!isLoading && (
        <div>
          <button onClick={(_) => regenerateGraphs()}>Regenerate Graphs</button>
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
    </>
  );
}

export default ManualTester;
