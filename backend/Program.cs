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
    var _InfTo5C = Interval.InfToNum(5, false);
    var _5CToInf = Interval.NumToInf(5, false);
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

void TestIntersection()
{
    var i1 = Interval.InfToNum(5, true);
    var i2 = Interval.InfToNum(0, false);
    var i3 = Interval.NumToNum((0,1), (true,true));
    var i4 = Interval.NumToNum((0,1), (false,false));
    var i5 = Interval.NumToNum((3,5),(false,false));
    var i6 = Interval.InfToNum(4, true);

    var intersect1 = i3.Intersect(i4);
    Assert.True(intersect1.IsOpen == (true, true) && intersect1.IntervalData == (0,1));


    var intersect2 = i1.Intersect(i4);
    Assert.True(intersect2.IsOpen == (false, false) && intersect2.IntervalData == (0,1));
    
    var intersect3 = i5.Intersect(i6);
    Assert.True(intersect3.IsOpen == (false, true) && intersect3.IntervalData == (3,4) && intersect3.NegInf == false);
}

TestIntervalAndGraph();
TestIntersection();

var t1 = new List<IInput>
{
    new IntervalDTO(Expressions.Lower, Interval.InfToNum(3,true), 1),
    new IntervalDTO(Expressions.Equal, Interval.NumToNum((5, 5),(false, false)), 1),
    // new IntervalDTO(Expressions.Interval, Interval.NumToNum((-30, 7),(false, true)), 1),
};

var t2 = new List<IInput>
{
    new IntervalDTO(Expressions.Lower, Interval.InfToNum(1,true), 1),
    new IntervalDTO(Expressions.Equal, Interval.NumToNum((2, 2),(false, false)), 1),
    // new IntervalDTO(Expressions.Interval, Interval.NumToNum((-2, 20),(false, true)), 1),

};

var t3 = new List<IInput>
{
    new IntervalDTO(Expressions.Interval, Interval.NumToNum((-1,1),(true, true)), 1),
    new IntervalDTO(Expressions.LowerAndEqual, Interval.InfToNum(10,false), 1),
    // new IntervalDTO(Expressions.Interval, Interval.NumToNum((-10, 50),(false, true)), 1),
};

var graph = GraphGenerator.GenerateGraph(new List<List<IInput>> { t1, t3 });
GraphGenerator.PrintGraphUrl(graph);


var MONKEgraph = MONKE.RunMONKE(graph);
GraphGenerator.PrintGraphUrl(MONKEgraph);
