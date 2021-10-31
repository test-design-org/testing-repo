using System;
using TestingBackend;

namespace backend.DTO
{
    public class IntervalDTO : IInput
    {
        public Expressions Expression { get; set; }
        public Interval Interval { get; set; }

        public float Precision { get; set; }

        public Guid Id { get; } = Guid.NewGuid();

        public IntervalDTO(Expressions expression, Interval interval, float precision)
        {
            Expression = expression;
            Interval = interval;
            Precision = precision;
        }
    }
}
