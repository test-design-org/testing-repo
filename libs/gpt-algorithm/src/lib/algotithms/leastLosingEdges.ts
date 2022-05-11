import { Graph } from '@testing-repo/gpt-common';
import {
  joinNodesOnEdge,
  minimumBy,
  numberOfConnectedComponentsComponents,
} from './common';
import { createGraphUrl } from '../graphGenerator';

function evaluateEdgesEdgeLosingCount(graph: Graph) {
  const initialEdgeCount = graph.edges.length;
  for (const edge of graph.edges) {
    const workingGraph = graph.shallowClone();

    joinNodesOnEdge(workingGraph, edge);

    const newEdgeCount = graph.edges.length;
    edge[2] = newEdgeCount - initialEdgeCount;
  }
  // console.log(
  //   'Partial data, least losing edges graph: ',
  //   createGraphUrl(graph),
  // );
}

export function runLeastLosingEdges(_graph: Graph): Graph {
  const graph = _graph.shallowClone();

  while (graph.edges.length > 0) {
    evaluateEdgesEdgeLosingCount(graph);

    const edgeToJoin = minimumBy(graph.edges, (x) => x[2]);

    joinNodesOnEdge(graph, edgeToJoin);
  }

  return graph;
}
