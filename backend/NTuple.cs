using System;
using System.Collections.Generic;
using backend.DTO;
using TestingBackend;

namespace backend
{
    public class NTuple : IHasId<Guid>
    {
        public Guid Id {get;} = Guid.NewGuid();

        public List<IInput> List {get; set;}
    }
}