using System.Linq;
using System;
using System.Collections.Generic;
using backend.DTO;

namespace backend.Models
{
    public class NTuple
    {
        public List<IInput> List { get; set; } = new ();

        public bool IntersectsWith(NTuple other)
        {
            if (List.Count != other.List.Count)
                return false;

            return List.Zip(other.List)
                       .All(x => x.First.IntersectsWith(x.Second));
        }

        public override bool Equals(object? obj) => Equals(obj as NTuple);

        private bool Equals(NTuple? that)
        {
            if (that == null || GetType() != that.GetType())
                return false;

            if(ReferenceEquals(that, this))
                return true;
            
            return this.List.SequenceEqual(that.List);
        }

        public override int GetHashCode() =>
            List.Aggregate(0, (item, hashCode) => HashCode.Combine(item.GetHashCode(), hashCode));

        public override string ToString()
        {
            var elements = String.Join(",", List);
            return $"({elements})";
        }
    }
}
