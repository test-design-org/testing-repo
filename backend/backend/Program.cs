using System;
using backend;
using backend.Algorithms;
using backend.Benchmarks;
using BenchmarkDotNet.Running;


var graph = GraphGenerator.GenerateGraph(BenchmarkData2.TestInput4);
GraphGenerator.PrintGraphUrl(graph);
Console.WriteLine();

var MONKEgraph = MONKE.RunMONKE(graph);
GraphGenerator.PrintGraphUrl(MONKEgraph);
Console.WriteLine();

var LeastLosingGraph = LeastLosing.RunLeastLosing(graph);
GraphGenerator.PrintGraphUrl(LeastLosingGraph);
Console.WriteLine();

// var summary = BenchmarkRunner.Run<Benchmarks>();
