using System;
using System.Collections.Generic;
using backend.DTO;
using TestingBackend;

namespace backend
{
    public static class TestCaseGenerator
    {
        public static HashSet<List<IInput>> GenerateTestCases(List<IInput> inputs)
        {
            var output = new HashSet<List<IInput>>();

            output.Add(CalculateInOnPatterns1(inputs));
            output.Add(CalculateInOnPatterns2(inputs));

            var oof = OffOut(inputs);

            foreach(var xd in oof)
            {
                output.Add(xd);
            }

            return output;
        }

        private static List<IInput> CalculateInOnPatterns1(List<IInput> inputs)
        {
            List<IInput> output = new();

            foreach (var input in inputs)
            {
                switch (input.Expression)
                {
                    case Expressions.Lower:
                    case Expressions.LowerAndEqual:
                        output.Add(In(input, 1));
                    break;

                    case Expressions.Higher:
                    case Expressions.HigherAndEqual:
                    case Expressions.NotEqual:
                        output.Add(In(input, 2));
                    break;

                    case Expressions.Equal:
                        output.Add(On(input));
                    break;

                    case Expressions.BoolTrue:
                    case Expressions.BoolFalse:
                        output.Add(input);
                    break;

                    case Expressions.Interval:
                        output.Add(On(input, 2));
                    break;
                    
                    default:
                    break;
                }
            }

            return output;
        }

        private static List<IInput> CalculateInOnPatterns2(List<IInput> inputs)
        {
            List<IInput> output = new();

            foreach (var input in inputs)
            {
                switch (input.Expression)
                {
                    case Expressions.Lower:
                    case Expressions.LowerAndEqual:
                        output.Add(On(input, 1));
                    break;
                    case Expressions.Equal:
                        output.Add(On(input));
                    break;

                    case Expressions.Higher:
                    case Expressions.HigherAndEqual:
                        output.Add(On(input, 2));
                    break;

                    case Expressions.NotEqual:
                        output.Add(In(input, 1));
                    break;

                    case Expressions.BoolTrue:
                    case Expressions.BoolFalse:
                        output.Add(input);
                    break;

                    case Expressions.Interval:
                        output.Add(On(input, 1));
                    break;
                    
                    default:
                    break;
                }
            }

            return output;
        }

        private static List<IInput> BaseLine(List<IInput> inputs)
        {
            List<IInput> output = new();

            foreach (var input in inputs)
            {
                switch (input.Expression)
                {
                    case Expressions.Lower:
                    case Expressions.LowerAndEqual:
                        output.Add(In(input, 1));
                    break;

                    case Expressions.Higher:
                    case Expressions.HigherAndEqual:
                    case Expressions.NotEqual:
                        output.Add(In(input, 2));
                    break;

                    case Expressions.Equal:
                        output.Add(On(input));
                    break;

                    case Expressions.BoolTrue:
                    case Expressions.BoolFalse:
                        output.Add(input);
                    break;

                    case Expressions.Interval:
                        output.Add(In(input, 3));
                    break;
                    
                    default:
                    break;
                }
            }

            return output;
        }

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
                        based1[i] = Out(inputs[i], 1);
                        based2[i] = Out(inputs[i], 2);

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

        private static IInput On(IInput input, int version = 0)
        {
            var temp = input as IntervalDTO;
            switch (version)
            {
                case 1 : // <, <=, Interval Right
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.High - (temp.Interval.IsOpen.High ? 1 : 0) * temp.Precision, 
                            temp.Interval.IntervalData.High - (temp.Interval.IsOpen.High ? 1 : 0) * temp.Precision),
                            (false, false)
                            ),
                            temp.Precision
                        );
                case 2 : // >, >=, Interval left
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.Low + (temp.Interval.IsOpen.Low ? 1 : 0) * temp.Precision,
                            temp.Interval.IntervalData.Low + (temp.Interval.IsOpen.Low ? 1 : 0) * temp.Precision),
                            (false, false)
                            ),
                            temp.Precision
                        );
                default : // ==
                    return new IntervalDTO(input.Expression, temp.Interval, temp.Precision);
            }
        }

        private static IInput? In(IInput input, int version = 0)
        {
            var temp = input as IntervalDTO;
            switch (version)
            {
                case 1 : // <, <=
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.InfToNum(
                            temp.Interval.IntervalData.High - (temp.Interval.IsOpen.High ? 2 : 1) * temp.Precision,
                            (true, false)
                            ),
                            temp.Precision
                        );
                case 2 : // >, =>
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToInf(
                            temp.Interval.IntervalData.Low + (temp.Interval.IsOpen.Low ? 2 : 1) * temp.Precision,
                            (false, true)
                            ),
                            temp.Precision
                        );
                case 3 : // Interval
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.Low + (temp.Interval.IsOpen.Low ? 2 : 1) * temp.Precision,
                            temp.Interval.IntervalData.High - (temp.Interval.IsOpen.High ? 2 : 1) * temp.Precision),
                            (false, false)
                            ),
                            temp.Precision
                        );
                default :
                    return null;
            }
        }

        private static IInput? Off(IInput input, int version = 0)
        {
            var temp = input as IntervalDTO;
            switch (version)
            {
                case 1 : // <, <=, Interval Right, == right
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.High + (temp.Interval.IsOpen.High ? 0 : 1) * temp.Precision, 
                            temp.Interval.IntervalData.High + (temp.Interval.IsOpen.High ? 0 : 1) * temp.Precision),
                            (false, false)
                            ),
                            temp.Precision
                        );
                case 2 : // >, >=, // Interval left, == left
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.Low - (temp.Interval.IsOpen.Low ? 0 : 1) * temp.Precision,
                            temp.Interval.IntervalData.Low - (temp.Interval.IsOpen.Low ? 0 : 1) * temp.Precision),
                            (false, false)
                            ),
                            temp.Precision
                        );
                default :
                    return new IntervalDTO(
                        temp.Expression,
                        temp.Interval,
                        temp.Precision
                    );
            }
        }

        private static IInput? Out(IInput input, int version = 0)
        {
            var temp = input as IntervalDTO;
            switch (version)
            {
                case 1 : // <, <=, Interval Right
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToInf(
                            temp.Interval.IntervalData.High + (temp.Interval.IsOpen.High ? 1 : 2) * temp.Precision,
                            (false, true)
                            ),
                            temp.Precision
                        );
                case 2 : // >, =>, Interval Left
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.InfToNum(
                            temp.Interval.IntervalData.Low - (temp.Interval.IsOpen.Low ? 1 : 2) * temp.Precision,
                            (true, false)
                            ),
                            temp.Precision
                        );
                default :
                    return null;
            }
        }
    }
}