using backend;
using backend.Algorithms;
using backend.Benchmarks;

var graph = GraphGenerator.GenerateGraph(BenchmarkData.TestInput2);
GraphGenerator.PrintGraphUrl(graph);


var MONKEgraph = MONKE.RunMONKE(graph);
GraphGenerator.PrintGraphUrl(MONKEgraph);

// var summary = BenchmarkRunner.Run<Benchmarks>();
