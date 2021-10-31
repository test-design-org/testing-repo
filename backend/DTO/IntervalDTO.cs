using System;
using NUnit.Framework.Constraints;
using Interval = TestingBackend.Interval;

namespace backend.DTO
{
    public record IntervalDTO(Expressions Expression, Interval Interval, float Precision) : IInput;
}
