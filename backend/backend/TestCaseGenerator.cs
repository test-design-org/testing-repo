using System;
using System.Collections.Generic;
using System.Linq;
using backend.DTO;
using backend.Models;

namespace backend
{
    public static class TestCaseGenerator
    {
        public static HashSet<NTuple> GenerateTestCases(List<IInput> inputs) =>
            new HashSet<List<IInput>> { 
                    CalculateInOnPatterns1(inputs), 
                    CalculateInOnPatterns2(inputs) }
                .Union(OffOut(inputs))
                .Select(x => new NTuple
                {
                    List = x
                })
                .ToHashSet();

        private static List<IInput> CalculateInOnPatterns1(List<IInput> inputs) =>

            inputs.Select(input => input.Expression switch {
                Expressions.Lower or
                Expressions.LowerAndEqual => InIn(input, 1),

                Expressions.Higher or
                Expressions.HigherAndEqual => InIn(input, 2),

                Expressions.NotEqual => In(input, 2),

                Expressions.Equal => On(input),

                Expressions.BoolTrue or
                Expressions.BoolFalse => input,

                Expressions.Interval => On(input, 2),
            })
            .ToList();

        private static List<IInput> CalculateInOnPatterns2(List<IInput> inputs) =>
            inputs.Select(input => input.Expression switch {
                Expressions.Lower or 
                Expressions.LowerAndEqual => On(input, 1),

                Expressions.Equal => On(input),

                Expressions.Higher or
                Expressions.HigherAndEqual => On(input, 2),

                Expressions.NotEqual => In(input, 1),

                Expressions.BoolTrue or
                Expressions.BoolFalse => input,

                Expressions.Interval => On(input, 1),
            })
            .ToList();

        private static List<IInput> BaseLine(List<IInput> inputs) =>
            inputs.Select(input => input.Expression switch {
                Expressions.Lower or
                Expressions.LowerAndEqual => In(input, 1),

                Expressions.Higher or
                Expressions.HigherAndEqual or
                Expressions.NotEqual => In(input, 2),

                Expressions.Equal => On(input),

                Expressions.BoolTrue or
                Expressions.BoolFalse => input,

                Expressions.Interval => In(input, 3),
            })
            .ToList();

        private static HashSet<List<IInput>> OffOut(List<IInput> inputs)
        {
            var output = new HashSet<List<IInput>>();

            for (var i = 0; i < inputs.Count; ++i)
            {
                var based1 = BaseLine(inputs);
                var based2 = BaseLine(inputs);

                switch (inputs[i].Expression)
                {
                    case Expressions.Lower:
                    case Expressions.LowerAndEqual:
                        based1[i] = Out(inputs[i], 1);
                        based2[i] = Off(inputs[i], 1);

                        output.Add(based1);
                        output.Add(based2);
                    break;
                    case Expressions.Higher:
                    case Expressions.HigherAndEqual:
                        based1[i] = Out(inputs[i], 2);
                        based2[i] = Off(inputs[i], 2);

                        output.Add(based1);
                        output.Add(based2);
                    break;

                    case Expressions.Equal:
                        based1[i] = Out(inputs[i], 3);
                        based2[i] = Out(inputs[i], 4);

                        output.Add(based1);
                        output.Add(based2);
                    break;

                    case Expressions.NotEqual:
                        based1[i] = Off(inputs[i]);

                        output.Add(based1);
                    break;

                    case Expressions.BoolTrue:
                        based1[i] = new BoolDTO(inputs[i].Expression, false);
                        output.Add(based1);
                    break;
                    case Expressions.BoolFalse:
                        based1[i] = new BoolDTO(inputs[i].Expression, true);
                        output.Add(based1);
                    break;

                    case Expressions.Interval:
                        var based3 = BaseLine(inputs);
                        var based4 = BaseLine(inputs);

                        based1[i] = Out(inputs[i], 1);
                        based2[i] = Out(inputs[i], 2);
                        based3[i] = Off(inputs[i], 1);
                        based4[i] = Off(inputs[i], 2);

                        output.Add(based1);
                        output.Add(based4);
                        output.Add(based3);
                        output.Add(based2);
                    break;
                }
            }

            return output;
        }

        private static IInput On(IInput input, int version = 0) {
            if(input is IntervalDTO interval)
                return On(interval, version);

            throw new ArgumentException("On's argument must be anm IntervalDTO");
        }

        private static IntervalDTO On(IntervalDTO input, int version = 0) =>
            version switch {
                // <, <=, Interval Right
                1 => new (
                        input.Expression,
                        Interval.NumToNum(
                            (input.Interval.IntervalData.High - (input.Interval.IsOpen.High ? 1 : 0) * input.Precision, 
                            input.Interval.IntervalData.High - (input.Interval.IsOpen.High ? 1 : 0) * input.Precision),
                            (false, false)
                            ),
                            input.Precision
                        ),
                // >, >=, Interval left
                2 => new (
                        input.Expression,
                        Interval.NumToNum(
                            (input.Interval.IntervalData.Low + (input.Interval.IsOpen.Low ? 1 : 0) * input.Precision,
                            input.Interval.IntervalData.Low + (input.Interval.IsOpen.Low ? 1 : 0) * input.Precision),
                            (false, false)
                            ),
                            input.Precision
                        ),
                // ==
                _ => new (input.Expression, input.Interval, input.Precision),
            };

        private static IInput In(IInput input, int version = 0)
        {
            if(input is IntervalDTO interval)
                return In(interval, version);

            throw new ArgumentException("In's argument must be an IntervalDTO");
        }

        private static IntervalDTO In(IntervalDTO input, int version = 0) =>
            version switch {
                 // <, <=
                1 => new (
                        input.Expression,
                        Interval.InfToNum(
                            input.Interval.IntervalData.High - (input.Interval.IsOpen.High ? 2 : 1) * input.Precision,
                            false
                            ),
                            input.Precision
                        ),
                // >, =>
                2 => new (
                        input.Expression,
                        Interval.NumToInf(
                            input.Interval.IntervalData.Low + (input.Interval.IsOpen.Low ? 2 : 1) * input.Precision,
                            false
                            ),
                            input.Precision
                        ),
                // Interval
                3 => new (
                        input.Expression,
                        Interval.NumToNum(
                            (input.Interval.IntervalData.Low + (input.Interval.IsOpen.Low ? 2 : 1) * input.Precision,
                            input.Interval.IntervalData.High - (input.Interval.IsOpen.High ? 2 : 1) * input.Precision),
                            (false, false)
                            ),
                            input.Precision
                        ),
            };

        private static IInput InIn(IInput input, int version = 0)
        {
            if(input is IntervalDTO interval)
                return InIn(interval, version);

            throw new ArgumentException("In's argument must be an IntervalDTO");
        }

        private static IntervalDTO InIn(IntervalDTO input, int version = 0) =>
            version switch {
                 // <, <=
                1 => new (
                        input.Expression,
                        Interval.InfToNum(
                            input.Interval.IntervalData.High - (input.Interval.IsOpen.High ? 3 : 2) * input.Precision,
                            false
                            ),
                            input.Precision
                        ),
                // >, =>
                2 => new (
                        input.Expression,
                        Interval.NumToInf(
                            input.Interval.IntervalData.Low + (input.Interval.IsOpen.Low ? 3 : 2) * input.Precision,
                            false
                            ),
                            input.Precision
                        )
            };

        private static IInput Off(IInput input, int version = 0)
        {
            if(input is IntervalDTO interval)
                return Off(interval, version);

            throw new ArgumentException("Off's argument must be anm IntervalDTO");
        }

        private static IntervalDTO Off(IntervalDTO input, int version = 0) =>
            version switch
            {
                // <, <=, Interval Right, == right
                1 => new (
                        input.Expression,
                        Interval.NumToNum(
                            (input.Interval.IntervalData.High + (input.Interval.IsOpen.High ? 0 : 1) * input.Precision, 
                             input.Interval.IntervalData.High + (input.Interval.IsOpen.High ? 0 : 1) * input.Precision),
                            (false, false)
                            ),
                            input.Precision
                        ),
                // >, >=, // Interval left, == left
                2 => new IntervalDTO(
                        input.Expression,
                        Interval.NumToNum(
                            (input.Interval.IntervalData.Low - (input.Interval.IsOpen.Low ? 0 : 1) * input.Precision,
                             input.Interval.IntervalData.Low - (input.Interval.IsOpen.Low ? 0 : 1) * input.Precision),
                            (false, false)
                            ),
                            input.Precision
                        ),
                _ => new (
                        input.Expression,
                        input.Interval,
                        input.Precision
                    ),
            };

        private static IInput Out(IInput input, int version = 0)
        {
            if(input is IntervalDTO interval)
                return Out(interval, version);

            throw new ArgumentException("Out's argument must be anm IntervalDTO");
        }

        private static IntervalDTO Out(IntervalDTO input, int version = 0) =>
            version switch {
                // <, <=, Interval Right
                1 => new (
                        input.Expression,
                        Interval.NumToInf(
                            input.Interval.IntervalData.High + (input.Interval.IsOpen.High ? 1 : 2) * input.Precision,
                            false
                            ),
                            input.Precision
                        ),
                // >, =>, Interval Left
                2 => new (
                        input.Expression,
                        Interval.InfToNum(
                            input.Interval.IntervalData.Low - (input.Interval.IsOpen.Low ? 1 : 2) * input.Precision,
                            false
                            ),
                            input.Precision
                        ),
                // =, Right
                3 => new (
                    input.Expression,
                    Interval.NumToInf(
                        input.Interval.IntervalData.High + input.Precision,
                        false
                    ),
                    input.Precision
                ),
                // =, Left
                4 => new (
                    input.Expression,
                    Interval.InfToNum(
                        input.Interval.IntervalData.Low - input.Precision,
                        false
                    ),
                    input.Precision
                ),
            };
    }
}
