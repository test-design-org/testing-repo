using System;
using System.Xml.Xsl;

namespace TestingBackend
{
    public class Interval : IHasId<Guid>
    {
        private bool _negInf = false;
        private bool _posInf = false;
        private (double Low, double High) _interval = (0, 0);
        private (bool Low, bool High) _isOpen = (false, false);
        public Guid Id { get; } = Guid.NewGuid();
        public (double Low, double High) IntervalData => _interval;
        public (bool Low, bool High) IsOpen => _isOpen;

        private Interval()
        {
        }

        // (-Inf,5.5)
        public static Interval InfToNum(double num, (bool Low, bool High) isOpen) =>
            new()
            {
                _negInf = true, 
                _interval = (0, num), 
                _isOpen = isOpen
            };
        
        // (5.5,Inf)
        public static Interval NumToInf(double num, (bool Low, bool High) isOpen) =>
            new()
            {
                _posInf = true, 
                _interval = (num, 0), 
                _isOpen = isOpen
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
    }
}