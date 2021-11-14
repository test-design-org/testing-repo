import { number } from 'fp-ts';
import { union } from 'fp-ts/lib/Array';
import { Edge, Graph } from '../graph';
import { NTuple } from '../models/ntuple';

export function replaceNodes(
  graph: Graph,
  a: NTuple,
  b: NTuple,
  newNTuple: NTuple,
) {
  const adjacentNodes = union(NTuple.Eq)(
    graph.getNeighbours(a),
    graph.getNeighbours(b),
  ).filter((x) => !NTuple.Eq.equals(x, a) && !NTuple.Eq.equals(x, b));

  graph.removeNode(a);
  graph.removeNode(b);

  graph.addNode(newNTuple);

  for (const node of adjacentNodes) {
    if (newNTuple.intersectsWith(node)) graph.addEdge(newNTuple, node, 0);
  }
}

export function joinNodesOnEdge(graph: Graph, edge: Edge): NTuple {
  const joinedNTuple = edge[0].intersect(edge[1]);

  replaceNodes(graph, edge[0], edge[1], joinedNTuple);

  return joinedNTuple;
}

export function minimumBy<T>(list: T[], lens: (_: T) => number): T {
  return list.reduce((minimum, x) => (lens(x) < lens(minimum) ? x : minimum));
}

export function numberOfConnectedComponentsComponents(graph: Graph): number {
  const ids = graph.nodes.map((node, id) => [node, id] as const);
  const getId = (node: NTuple) => ids.find((x) => x[0] === node)![1];

  const DFSUtil = (nodeId: number, visited: boolean[]) => {
    visited[nodeId] = true;

    const neighbours = graph.getNeighbours(graph.nodes[nodeId]).map(getId);
    for (const neighbourId of neighbours) {
      if (!visited[neighbourId]) {
        DFSUtil(neighbourId, visited);
      }
    }
  };

  const visited = new Array(graph.nodes.length).map((_) => false);

  let componentCount = 0;
  for (let nodeId = 0; nodeId < visited.length; ++nodeId) {
    if (!visited[nodeId]) {
      DFSUtil(nodeId, visited);
      ++componentCount;
    }
  }

  return componentCount;
}

export function dfs(
  graph: Graph,
  startingNode: NTuple,
  events: {
    discoverNode?: (node: NTuple) => void;
  },
): void {
  const ids = graph.nodes.map((node, id) => [node, id] as const);
  const getId = (node: NTuple) => ids.find((x) => x[0] === node)![1];

  const DFSUtil = (nodeId: number, visited: boolean[]) => {
    visited[nodeId] = true;
    events.discoverNode?.(graph.nodes[nodeId]);

    const neighbours = graph.getNeighbours(graph.nodes[nodeId]).map(getId);
    for (const neighbourId of neighbours) {
      if (!visited[neighbourId]) {
        DFSUtil(neighbourId, visited);
      }
    }
  };

  const visited = new Array(graph.nodes.length).map((_) => false);

  DFSUtil(getId(startingNode), visited);
}
