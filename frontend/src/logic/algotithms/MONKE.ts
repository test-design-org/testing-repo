import { Graph } from '../graph';
import { joinNodesOnEdge } from './common';

export function runMONKE(_graph: Graph): Graph {
  const graph = _graph.shallowClone();

  while (graph.edges.length > 0) {
    const edge = graph.edges[0];

    joinNodesOnEdge(graph, edge);
  }

  return graph;
}
