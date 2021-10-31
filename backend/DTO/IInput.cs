using System;
using TestingBackend;

namespace backend.DTO
{

    public interface IInput : IHasId<Guid>
    {
        Expressions Expression {get; set;}
    }   
}

