using System;
using System.Collections.Generic;
using System.Linq;
using backend.DTO;
using QuikGraph;
using QuikGraph.Graphviz;
using QuikGraph.Graphviz.Dot;

namespace backend
{
    public static class GraphGenerator
    {
        public static UndirectedGraph<NTuple, TaggedEdge<NTuple,int>> GenerateGraph(List<List<IInput>> inputs)
        {
            var nTuples = inputs.SelectMany(TestCaseGenerator.GenerateTestCases);

            var graph = GenerateEdges(nTuples)
                .ToUndirectedGraph<NTuple, TaggedEdge<NTuple,int>>(allowParallelEdges: false);
            
            return graph;
        }

        private static IEnumerable<TaggedEdge<NTuple,int>> GenerateEdges(IEnumerable<NTuple> nTuples)
        {
            // Convert to list to prevent double-enumeration
            var enumerable = nTuples.ToArray();
            foreach (var item in enumerable)
            {
                foreach (var item2 in enumerable)
                {
                    if (ReferenceEquals(item, item2))
                        continue;
        
                    if (item.IntersectsWith(item2))
                    {
                        yield return new (item, item2, 0);
                    }
                }
            }
        }

        public static void PrintGraphUrl(UndirectedGraph<NTuple, TaggedEdge<NTuple, int>> graph)
        {
            var dotGraph = graph.ToGraphviz(algorithm =>
            {
                // Custom init example
                var expressions = graph.Vertices.First().List.Select(x => x.Expression);
                algorithm.GraphFormat.Comment = $"({string.Join(",", expressions)})";
    
                algorithm.CommonVertexFormat.Shape = GraphvizVertexShape.Box;
                algorithm.FormatVertex += (sender, args) =>
                {
                    args.VertexFormat.Label = args.Vertex.ToString();
                };
            });
            var url = $"https://dreampuf.github.io/GraphvizOnline/#{Uri.EscapeDataString(dotGraph)}";
            Console.WriteLine(url);
        }
    }
}