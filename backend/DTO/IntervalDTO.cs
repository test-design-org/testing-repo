using TestingBackend;

namespace backend.DTO
{
    public class IntervalDTO : IInput
    {
        public Expressions Expression { get; set; }
        public Interval? Interval {get; set;} = null;

        public float Precision {get; set;} = 0f;

        public IntervalDTO(Expressions expression, Interval interval, float precision)
        {
            Expression = expression;
            Interval = interval;
            Precision = precision;
        }
    }
}