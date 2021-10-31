using System;
using System.Collections.Generic;
using System.Linq;
using backend;
using backend.DTO;
using NUnit.Framework;
using QuikGraph;
using TestingBackend;


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
        if (left.Id != right.Id && left.IntersectsWith(right))
        {
            graph.AddEdge(new (left, right, 0));
        }
    }
}

// If these assertions pass the code will continue, else it will fail
Assert.True(graph.OutEdges(_InfTo5C).Any(x => x.Target.Id == _5CToInf.Id));
Assert.True(graph.OutEdges(_InfTo5C).Any(x => x.Target.Id == _1CTo3C.Id));
Assert.True(graph.OutEdges(_5CToInf).First().Target.Id == _InfTo5C.Id);
Assert.True(graph.OutEdges(_1CTo3C).First().Target.Id == _InfTo5C.Id);

var t = new List<IInput>
{
    new IntervalDTO(Expressions.Lower, Interval.InfToNum(3,(true, true)), 1),
    //new IntervalDTO(Expressions.HigherAndEqual, Interval.NumToInf(1,(false, true)), 1),
    //new IntervalDTO(Expressions.Interval, Interval.NumToNum((-1, 5),(false, true)), 1),
    new IntervalDTO(Expressions.Equal, Interval.NumToNum((5, 5),(false, false)), 1),
   // new IntervalDTO(Expressions.NotEqual, Interval.NumToNum((6, 6),(false, false)), 1)
};

var o = TestCaseGenerator.GenerateTestCases(t);

foreach (var l in o)
{
    Console.Write("(");
    foreach (IntervalDTO m in l)
    {
        Console.Write($"{m.Interval.IntervalData.Low} {m.Interval.IntervalData.High}, ");
    }
    Console.Write(")\n");
}

Console.WriteLine(o.Count);

BidirectionalGraph<NTuple, TaggedEdge<NTuple, int>> graph1 = new();

foreach (var item in o)
{
    var one = new NTuple();
    one.List = item;
    graph1.AddVertex(one);

    foreach (var item2 in o)
    {
        if (item == item2)
            continue;
        
        var two = new NTuple();
        two.List = item2;


        var inter = true;
        var i = 0;
        while (inter && i < item.Count)
        {  

            if (item[i] is IntervalDTO)
            {
                inter = (item[i] as IntervalDTO).Interval.IntersectsWith((item2[i] as IntervalDTO).Interval);
            }
            else
            {
                inter = (item[i] as BoolDTO).BoolVal == (item2[i] as BoolDTO).BoolVal;
            }
            ++i;
        }

        if (inter)
        {
            graph1.AddEdge(new (one, two, 0));
        }

    }
}

foreach (var item in o)
{
    var xd = new NTuple
    {
        List = item
    };
    
    foreach (var item2 in graph1.OutEdges(xd))
    {
        item2.Target.List.ForEach(p => Console.WriteLine( p is IntervalDTO ? $"{(p as IntervalDTO).Interval.IntervalData.Low} {(p as IntervalDTO).Interval.IntervalData.High}" : (p as BoolDTO).BoolVal));
    }
}
