using System.Linq;
using backend.Models;
using QuikGraph;

namespace backend.Algorithms
{
    public class MONKE
    {
        public static UndirectedGraph<NTuple, TaggedEdge<NTuple, int>> RunMONKE(
            UndirectedGraph<NTuple, TaggedEdge<NTuple, int>> _graph)
        {
            var graph = _graph.Clone();
            while(graph.Edges.Any())
            {
                // Get a random edge instead of first?
                var edge = graph.Edges.First();
                var intersectedInputs = edge.Source.List.Zip(edge.Target.List)
                    .Select(x => x.First.Intersect(x.Second))
                    .ToList();
                
                var newNTuple = new NTuple
                {
                    List = intersectedInputs,
                };

                ReplaceVertexes(graph, edge.Source, edge.Target, newNTuple);
            }

            return graph;
        }

        private static void ReplaceVertexes(UndirectedGraph<NTuple, TaggedEdge<NTuple, int>> graph, NTuple a, NTuple b,
            NTuple newVertex)
        {
            var adjacentVerticies = graph
                .AdjacentVertices(a)
                .Union(graph.AdjacentVertices(b))
                .Where(x => !x.Equals(a) && !x.Equals(b));

            graph.RemoveVertex(a);
            graph.RemoveVertex(b);

            graph.AddVertex(newVertex);

            foreach (var vertex in adjacentVerticies)
            {
                if (newVertex.IntersectsWith(vertex))
                    graph.AddEdge(new(newVertex, vertex, 0));
            }
        }
    }
}