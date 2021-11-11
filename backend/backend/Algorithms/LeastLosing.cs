using System;
using System.Collections.Generic;
using System.Linq;
using backend.Models;
using QuikGraph;
using QuikGraph.Algorithms;
using QuikGraph.Algorithms.Search;
using Graph = QuikGraph.UndirectedGraph<backend.Models.NTuple, QuikGraph.TaggedEdge<backend.Models.NTuple, int>>;

namespace backend.Algorithms
{
    public class LeastLosing
    {
        public static Graph RunLeastLosing(Graph _graph)
        {
            var graph = _graph.Clone();
            while(graph.Edges.Any())
            {
                // EvaluateEdgesComponentCount(graph);
                EvaluateEdgesReachableCount(graph);
                var edgeToJoin = graph.Edges.MinimumBy(x => x.Tag);
                JoinVertexesOnEdge(graph, edgeToJoin);
            }

            return graph;
        }
        

        private static void EvaluateEdgesComponentCount(Graph graph)
        {
            var initialComponentCount = graph.ConnectedComponents(new Dictionary<NTuple, int>());
            foreach (var edge in graph.Edges)
            {
                var workingGraph = graph.Clone();

                JoinVertexesOnEdge(workingGraph, edge);

                var componentCount = workingGraph.ConnectedComponents(new Dictionary<NTuple, int>());
                edge.Tag = componentCount - initialComponentCount;
            }
            Console.WriteLine(graph.Edges.Aggregate("", (str, x) => $"{str},{x.Tag}"));
        }
        
        private static void EvaluateEdgesReachableCount(Graph graph)
        {
            foreach (var edge in graph.Edges)
            {
                var workingGraph = graph.Clone();

                var initiallyReachable = VerteciesReachable(workingGraph, edge.Source);
                var joinedNTuple = JoinVertexesOnEdge(workingGraph, edge);
                var reachableAfterTheJoin = VerteciesReachable(workingGraph, joinedNTuple);
                
                edge.Tag = initiallyReachable - reachableAfterTheJoin;
            }
            Console.WriteLine(graph.Edges.Aggregate("", (str, x) => $"{str},{x.Tag}"));
            GraphGenerator.PrintGraphUrl(graph);
        }

        private static int VerteciesReachable(Graph graph, NTuple from)
        {
            var dfs = new UndirectedDepthFirstSearchAlgorithm<NTuple, TaggedEdge<NTuple, int>>(graph);

            int count = 0;
            dfs.DiscoverVertex += v => count++;
            
            dfs.Compute(from);
            return count;
        }

        private static NTuple JoinVertexesOnEdge(Graph graph, TaggedEdge<NTuple, int> edge)
        {
            var intersectedInputs = edge.Source.List.Zip(edge.Target.List)
                .Select(x => x.First.Intersect(x.Second))
                .ToList();
                
            var newNTuple = new NTuple
            {
                List = intersectedInputs,
            };

            ReplaceVertexes(graph, edge.Source, edge.Target, newNTuple);

            return newNTuple;
        }
        
        private static void ReplaceVertexes(Graph graph, NTuple a, NTuple b,
            NTuple newVertex)
        {
            var adjacentVertices = graph
                .AdjacentVertices(a)
                .Union(graph.AdjacentVertices(b))
                .Where(x => !x.Equals(a) && !x.Equals(b));

            graph.RemoveVertex(a);
            graph.RemoveVertex(b);

            graph.AddVertex(newVertex);

            foreach (var vertex in adjacentVertices)
            {
                if (newVertex.IntersectsWith(vertex))
                    graph.AddEdge(new(newVertex, vertex, 0));
            }
        }
    }

    public static class LINQExtensions
    {
        public static T MinimumBy<T>(this IEnumerable<T> list, Func<T, decimal> f) =>
            list.Aggregate((minimum, x) => f(x) < f(minimum) ? x : minimum);
    }
}