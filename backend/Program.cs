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

Graph<NTuple, int> graph1 = new();

foreach (var item in o)
{
    var one = new NTuple();
    one.List = item;
    graph1.AddNode(one);

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
            graph1.AddEdge(one, two, 0);
        }

    }
}

foreach (var item in o)
{
    var xd = new NTuple();
    xd.List = item;
    foreach (var item2 in graph1.GetNeighbours(xd))
    {
        item2.Node.List.ForEach(p => Console.WriteLine( p is IntervalDTO ? $"{(p as IntervalDTO).Interval.IntervalData.Low} {(p as IntervalDTO).Interval.IntervalData.High}" : (p as BoolDTO).BoolVal));
    }
}


// If these assertions pass the code will continue, else it will fail
Assert.True(graph.GetNeighbours(_InfTo5C).Any(x => x.Node.Id == _5CToInf.Id));
Assert.True(graph.GetNeighbours(_InfTo5C).Any(x => x.Node.Id == _1CTo3C.Id));
Assert.True(graph.GetNeighbours(_5CToInf).First().Node.Id == _InfTo5C.Id);
Assert.True(graph.GetNeighbours(_1CTo3C).First().Node.Id == _InfTo5C.Id);

