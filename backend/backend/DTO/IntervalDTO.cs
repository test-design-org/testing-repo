using System;
using backend.Models;
using Interval = backend.Models.Interval;

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

        public IInput Intersect(IInput other)
        {
            if (!this.IntersectsWith(other))
                throw new ArgumentException("The two IntervalDTOs don't intersect with each other!");

            IntervalDTO that = (other as IntervalDTO)!;
            return new IntervalDTO(Expression, this.Interval.Intersect(that.Interval), Precision);
        }

        public override string ToString()
        {
            return $"{Interval}";
        }
    }
}
