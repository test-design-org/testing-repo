using System;

namespace backend.DTO
{
    public class BoolDTO : IInput
    {
        public Expressions Expression { get; set; }
        public bool BoolVal {get; set;}

        public Guid Id {get;} =  Guid.NewGuid();

        public BoolDTO(Expressions expression, bool boolVal)
        {
            Expression = expression;
            BoolVal = boolVal;
        }
    }
}