import { Graph } from './graph';
import type { IInput } from './models/dtos';
import { NTuple } from './models/ntuple';
import { generateTestCases } from './testCaseGenerator';

export function generateGraph(inputs: IInput[][]): Graph {
  const nTuples = inputs.flatMap(generateTestCases);

  const graph = new Graph();
  graph.addNodes(nTuples);

  for (const item1 of nTuples) {
    for (const item2 of nTuples) {
      if (NTuple.Eq.equals(item1, item2)) continue;

      if (item1.intersectsWith(item2)) graph.addEdge(item1, item2, Infinity);
    }
  }

  return graph;
}

export function createGraphUrl(graph: Graph): string {
  const ids = graph.nodes.map((node, id) => [node, id] as const);
  const getId = (node: NTuple) => ids.find((x) => x[0] === node)![1];

  const nodes = graph.nodes
    .map((node) => `${getId(node)} [label="${node}"]`)
    .join('\n');
  const edges = graph.edges
    .map(
      ([from, to, weight]) =>
        `${getId(from)} -- ${getId(to)} [label="${weight}"]`,
    )
    .join('\n')
    .replaceAll('Infinity', '∞');

  const dot = `graph G {
    node [shape=box]
    ${nodes}
    ${edges}
  }`;

  return encodeURI(`https://dreampuf.github.io/GraphvizOnline/#${dot}`);
}
