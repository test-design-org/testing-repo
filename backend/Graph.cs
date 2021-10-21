using System;
using System.Collections.Generic;
using System.Linq;

namespace TestingBackend {
    public interface IHasId<T>
    {
        public T Id { get; }
    }
    
    public class Graph<N,E> where N : IHasId<Guid>
    {
        private Dictionary<Guid, N> Nodes = new();
        private Dictionary<(Guid, Guid), E> Edges = new();

        public IEnumerable<N> GetNodes => Nodes.Values;

        public Graph() {}

        public void AddNode(N node)
        {
            Nodes.Add(node.Id, node);
        }

        public void RemoveNode(N node)
        {
            Nodes.Remove(node.Id);
        }

        public void AddEdge(N a, N b, E weight)
        {
            Edges.Add((a.Id, b.Id), weight);
        }

        public void RemoveEdge(N a, N b)
        {
            // the order might be different than what was added
            Edges.Remove((a.Id, b.Id));
            Edges.Remove((b.Id, a.Id));
        }

        public IEnumerable<(N Node, E Weight)> GetNeighbours(N node)
        {
            foreach (var ((edge1, edge2), weight) in Edges)
            {
                if (edge1 == node.Id)
                    yield return (Nodes[edge2], weight);

                if (edge2 == node.Id)
                    yield return (Nodes[edge1], weight);
            }
        }
    }
}
