using System;

namespace backend.DTO
{
    public record BoolDTO(Expressions Expression, bool BoolVal) : IInput;
}