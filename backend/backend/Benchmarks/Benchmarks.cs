using System.Collections.Generic;
using backend.Algorithms;
using backend.DTO;
using backend.Models;
using BenchmarkDotNet.Attributes;
using QuikGraph;
using Interval = backend.Models.Interval;

namespace backend.Benchmarks
{
    public class Benchmarks
    {
        private UndirectedGraph<NTuple, TaggedEdge<NTuple,int>> data;



        public static IEnumerable<List<List<IInput>>> BenchmarkSets => BenchmarkData2.GetBenchmarkSets;

        [ParamsSource(nameof(BenchmarkSets))]
        public List<List<IInput>> input;

        [GlobalSetup]
        public void Setup()
        {
            data = GraphGenerator.GenerateGraph(input);
        }

        [Benchmark]
        public UndirectedGraph<NTuple,TaggedEdge<NTuple,int>> Monke() => MONKE.RunMONKE(data);
        
        [Benchmark]
        public UndirectedGraph<NTuple,TaggedEdge<NTuple,int>> LeastLosing() => Algorithms.LeastLosing.RunLeastLosing(data);
    }
}