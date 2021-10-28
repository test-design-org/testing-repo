using System;
using System.Collections.Generic;
using System.Linq;
using backend;
using backend.DTO;
using NUnit.Framework;
using TestingBackend;

Console.WriteLine("Hello, World!");

var _InfTo5C = Interval.InfToNum(5, (false, false));
var _5CToInf = Interval.NumToInf(5, (false, false));
var _1CTo3C = Interval.NumToNum((1,3), (false, false));

var nodes = new List<Interval> { _InfTo5C, _5CToInf, _1CTo3C };

var graph = new Graph<Interval,int>();

foreach (var node in nodes)
{
    graph.AddNode(node);
}

foreach (var left in nodes)
{
    foreach (var right in nodes)
    {
        if (left.Id != right.Id && left.IntersectsWith(right))
        {
            graph.AddEdge(left, right, 0);
        }
    }
}

var t = new List<IInput>()
{
    new IntervalDTO(Expressions.Lower, Interval.InfToNum(3,(true, true)), 1),
    new IntervalDTO(Expressions.HigherAndEqual, Interval.NumToInf(1,(false, true)), 1),
    new IntervalDTO(Expressions.Interval, Interval.NumToNum((-1, 5),(false, true)), 1),
    new IntervalDTO(Expressions.Equal, Interval.NumToNum((6, 6),(false, false)), 1),
    new IntervalDTO(Expressions.NotEqual, Interval.NumToNum((6, 6),(false, false)), 1)
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


// If these assertions pass the code will continue, else it will fail
Assert.True(graph.GetNeighbours(_InfTo5C).Any(x => x.Node.Id == _5CToInf.Id));
Assert.True(graph.GetNeighbours(_InfTo5C).Any(x => x.Node.Id == _1CTo3C.Id));
Assert.True(graph.GetNeighbours(_5CToInf).First().Node.Id == _InfTo5C.Id);
Assert.True(graph.GetNeighbours(_1CTo3C).First().Node.Id == _InfTo5C.Id);

