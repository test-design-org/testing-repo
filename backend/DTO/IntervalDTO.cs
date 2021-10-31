using System;
using NUnit.Framework.Constraints;
using Interval = TestingBackend.Interval;

namespace backend.DTO
{
    public record IntervalDTO(Expressions Expression, Interval Interval, float Precision) : IInput
    {
        public bool IntersectsWith(IInput other)
        {
            if (other is IntervalDTO that)
                return this.Interval.IntersectsWith(that.Interval);

            return false;
        }

        public override string ToString()
        {
            return $"{Interval}";
        }
    }
}
