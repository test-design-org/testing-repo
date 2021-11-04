using System;
using backend.Models;

namespace backend.DTO
{
    public record BoolDTO(Expressions Expression, bool BoolVal) : IInput
    {
        public bool IntersectsWith(IInput other)
        {
            if (other is BoolDTO that)
                return this.BoolVal == that.BoolVal;

            return false;
        }

        public IInput Intersect(IInput other)
        {
            if (!this.IntersectsWith(other))
                throw new ArgumentException("The two BoolDTOs doesn't intersect with each other!");

            return new BoolDTO(Expression, BoolVal);
        }
    }
}