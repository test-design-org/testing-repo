using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Web;
using backend;
using backend.DTO;
using NUnit.Framework;
using QuikGraph;
using QuikGraph.Graphviz;
using QuikGraph.Graphviz.Dot;
using TestingBackend;

void TestIntervalAndGraph()
{
    var _InfTo5C = Interval.InfToNum(5, (false, false));
    var _5CToInf = Interval.NumToInf(5, (false, false));
    var _1CTo3C = Interval.NumToNum((1,3), (false, false));

    var nodes = new List<Interval> { _InfTo5C, _5CToInf, _1CTo3C };

    var graph = new BidirectionalGraph<Interval, TaggedEdge<Interval, int>>();

    graph.AddVertexRange(nodes);

    foreach (var left in nodes)
    {
        foreach (var right in nodes)
        {
            if (ReferenceEquals(left, right))
                continue;
            
            if (left.IntersectsWith(right))
            {
                graph.AddEdge(new (left, right, 0));
            }
        }
    }

    // If these assertions pass the code will continue, else it will fail
    Assert.True(graph.OutEdges(_InfTo5C).Any(x => x.Target == _5CToInf));
    Assert.True(graph.OutEdges(_InfTo5C).Any(x => x.Target == _1CTo3C));
    Assert.True(graph.OutEdges(_5CToInf).First().Target == _InfTo5C);
    Assert.True(graph.OutEdges(_1CTo3C).First().Target == _InfTo5C);
}

TestIntervalAndGraph();

var t1 = new List<IInput>
{
    new IntervalDTO(Expressions.Lower, Interval.InfToNum(3,(true, true)), 1),
    //new IntervalDTO(Expressions.HigherAndEqual, Interval.NumToInf(1,(false, true)), 1),
    //new IntervalDTO(Expressions.Interval, Interval.NumToNum((-1, 5),(false, true)), 1),
    new IntervalDTO(Expressions.Equal, Interval.NumToNum((5, 5),(false, false)), 1),
   // new IntervalDTO(Expressions.NotEqual, Interval.NumToNum((6, 6),(false, false)), 1)
};

var t2 = new List<IInput>
{
    new IntervalDTO(Expressions.Lower, Interval.InfToNum(1,(true, true)), 1),
    new IntervalDTO(Expressions.Equal, Interval.NumToNum((2, 2),(false, false)), 1),
};

var t3 = new List<IInput>
{
    new IntervalDTO(Expressions.Interval, Interval.NumToNum((-1,0),(true, true)), 1),
    new IntervalDTO(Expressions.LowerAndEqual, Interval.InfToNum(10,(false, false)), 1),
};

var graph = GraphGenerator.GenerateGraph(new List<List<IInput>> { t1, t2 });
GraphGenerator.PrintGraphUrl(graph);

