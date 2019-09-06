#include "edge.h"
#include "node.h"

Edge::Edge(Node *sourceNode, Node *destNode)
    //: arrowSize(10)
{
    source = sourceNode;
    dest = destNode;
    source->addEdge(this);
    dest->addEdge(this);

}
Node *Edge::sourceNode() const
{
    return source;
}

Node *Edge::destNode() const
{
    return dest;
}
