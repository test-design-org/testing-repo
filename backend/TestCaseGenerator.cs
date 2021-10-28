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
                        output.Add(On(input, 3));
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
                        output.Add(On(input, 1));
                    break;
                    case Expressions.LowerAndEqual:
                    case Expressions.HigherAndEqual:
                    case Expressions.Equal:
                        output.Add(On(input));
                    break;

                    case Expressions.Higher:
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
                        output.Add(On(input, 4));
                    break;
                    
                    default:
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
                case 1 : // <
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.InfToNum(
                            temp.Interval.IntervalData.High - temp.Precision,
                            (true, false)
                            ),
                            temp.Precision
                        );
                case 2 : // > 
                    return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToInf(
                            temp.Interval.IntervalData.Low + temp.Precision,
                            (false, true)
                            ),
                            temp.Precision
                        );
                case 3 : // Interval left
                    if (temp.Interval.IsOpen.Low)
                    {
                        return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.Low + temp.Precision,
                            temp.Interval.IntervalData.High),
                            (false, temp.Interval.IsOpen.High)
                            ),
                            temp.Precision
                        );
                    }
                    else
                    {
                        return new IntervalDTO(
                        temp.Expression,
                        temp.Interval,
                        temp.Precision);
                    }
                case 4 : // Interval Right
                    if (temp.Interval.IsOpen.High)
                    {
                        return new IntervalDTO(
                        temp.Expression,
                        Interval.NumToNum(
                            (temp.Interval.IntervalData.Low,
                            temp.Interval.IntervalData.High - temp.Precision),
                            (temp.Interval.IsOpen.Low, false)
                            ),
                            temp.Precision
                        );
                    }
                    else
                    {
                        return new IntervalDTO(
                        temp.Expression,
                        temp.Interval,
                        temp.Precision);
                    }
                default : // == and <=, >=
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
    }
}