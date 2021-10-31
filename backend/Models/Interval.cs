using System;
using backend;

namespace TestingBackend
{
    public record Interval
    {
        private bool _negInf = false;
        private bool _posInf = false;
        private (double Low, double High) _interval = (0, 0);
        private (bool Low, bool High) _isOpen = (false, false);
        public (double Low, double High) IntervalData => _interval;
        public (bool Low, bool High) IsOpen => _isOpen;
        public bool NegInf => _negInf;
        public bool PosInf => _posInf;

        private Interval()
        {
            if (IntervalData.Low > IntervalData.High)
                throw new ArgumentException("Interval low has to be <= than interval high.");
        }

        // (-Inf,5.5)
        public static Interval InfToNum(double num, bool isHighOpen) =>
            new()
            {
                _negInf = true, 
                _interval = (double.MinValue, num), 
                _isOpen = (true, isHighOpen),
            };
        
        // (5.5,Inf)
        public static Interval NumToInf(double num, bool isLowOpen) =>
            new()
            {
                _posInf = true, 
                _interval = (num, double.MaxValue), 
                _isOpen = (isLowOpen, true),
            };
        
        // (5.5,6.5)
        public static Interval NumToNum((double Low, double High) interval, (bool Low, bool High) isOpen) =>
            new()
            {
                _interval = interval, 
                _isOpen = isOpen
            };

        public bool IntersectsWith(Interval right)
        {
            var left = this;

            if (!left._posInf && !right._negInf &&
                ((!left._isOpen.High && !right._isOpen.Low && left._interval.High < right._interval.Low) ||
                 (left._isOpen.High && right._isOpen.Low && left._interval.High <= right._interval.Low)))
                return false;
            
            if (!right._posInf && !left._negInf &&
                ((!right._isOpen.High && !left._isOpen.Low && right._interval.High < left._interval.Low) ||
                 (right._isOpen.High && left._isOpen.Low && right._interval.High <= left._interval.Low)))
                return false;

            return true;
        }

        // used for constructing an interval with raw values
        private Interval((double val, bool open) start, (double val, bool open) end, bool negInf, bool posInf)
        {
            _negInf = negInf;
            _posInf = posInf;
            _interval = (start.val, end.val);
            _isOpen = (start.open, end.open);
        }
        
        // Max for intervals
        private (double outval, bool outbool) CustomMax((double val, bool open) inDouble1, (double val, bool open) inDouble2)
        {
            if(inDouble1.val > inDouble2.val)
                return inDouble1;
            
            if (inDouble1.val < inDouble2.val)
                return inDouble2;
            
            return (inDouble1.val, inDouble1.open || inDouble2.open);
        }

        // Min for intervals
        private (double outval, bool outbool) CustomMin((double val, bool inf) inDouble1, (double val, bool inf) inDouble2)
        {
            if (inDouble1.val < inDouble2.val)
                return inDouble1;
            
            if (inDouble1.val > inDouble2.val)
                return inDouble2;
            
            return (inDouble1.val, inDouble1.inf || inDouble2.inf);
        }

        // returns an intersection of this and another interval if possible.
        public Interval Intersect(Interval other)
        {
            if (!this.IntersectsWith(other))
                throw new ArgumentException("The two Intervals don't intersect with each other!");

            // start of interval
            (double val, bool open) OutStart = 
                CustomMax((this.IntervalData.Low, this.IsOpen.Low), (other.IntervalData.Low, other.IsOpen.Low));

            // end of interval
            (double val, bool open) OutEnd =
                CustomMin((this.IntervalData.High, this.IsOpen.High), (other.IntervalData.High, other.IsOpen.High));

            // checking inf values
            bool negInf = OutStart.val == double.MinValue;
            bool posInf = OutEnd.val == double.MaxValue;

            // constructing new interval
            return new Interval(OutStart, OutEnd, negInf, posInf);
        }

        public override string ToString()
        {
            string left = _negInf ? "-∞" : _interval.Low.ToString();
            string right = _posInf ? "∞" : _interval.High.ToString();

            string leftBrace = _isOpen.Low ? "(" : "[";
            string rightBrace = _isOpen.High ? ")" : "]";

            return $"{leftBrace}{left},{right}{rightBrace}";
        }
    }
}
