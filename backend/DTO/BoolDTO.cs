using System;

namespace backend.DTO
{
    public record BoolDTO(Expressions Expression, bool BoolVal) : IInput
    {
        public bool IntersectsWith(IInput other)
        {
            if (other is BoolDTO that)
                return this.Expression == that.Expression &&
                       this.BoolVal == that.BoolVal;

            return false;
        }
    }
}
