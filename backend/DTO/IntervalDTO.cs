using TestingBackend;

namespace backend.DTO
{
    public class IntervalDTO : IInput
    {
        public Expressions Expression { get; set; }
        public Interval? Interval {get; set;} = null;

        public IntervalDTO(Expressions expression, Interval interval)
        {
            Expression = expression;
            Interval = interval;
        }
    }
}