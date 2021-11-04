using System.Collections.Generic;
using backend.DTO;
using backend.Models;

namespace backend.Benchmarks
{
    public class BenchmarkData
    {
        public static List<IInput> T1 => new()
        {
            new IntervalDTO(Expressions.Lower, Interval.InfToNum(3,true), 1),
            new IntervalDTO(Expressions.Equal, Interval.NumToNum((5, 5),(false, false)), 1),
            // new IntervalDTO(Expressions.Interval, Interval.NumToNum((-30, 7),(false, true)), 1),
        };

        public static List<IInput> T2 => new()
        {
            new IntervalDTO(Expressions.Lower, Interval.InfToNum(1,true), 1),
            new IntervalDTO(Expressions.Equal, Interval.NumToNum((2, 2),(false, false)), 1),
            // new IntervalDTO(Expressions.Interval, Interval.NumToNum((-2, 20),(false, true)), 1),

        };

        public static List<IInput> T3 => new()
        {
            new IntervalDTO(Expressions.Interval, Interval.NumToNum((1,5),(true, true)), 1),
            new IntervalDTO(Expressions.LowerAndEqual, Interval.InfToNum(10,false), 1),
            // new IntervalDTO(Expressions.Interval, Interval.NumToNum((-10, 50),(false, true)), 1),
        };

        public static List<List<IInput>> TestInput1 => new() { T1, T2 };
        public static List<List<IInput>> TestInput2 => new() { T1, T3 };
        public static List<List<IInput>> TestInput3 => new() { T1, T2, T3 };

        public static IEnumerable<List<List<IInput>>> GetBenchmarkSets => new[]
        {
            TestInput1,
            TestInput2,
            TestInput3,
        };
    }
}