#include "edge.h"
#include "node.h"

using namespace ocvflow;

Edge::Edge(Node *origNode, Node *destNode)
    //: arrowSize(10)
{
    orig = origNode;
    dest = destNode;
    orig->addEdge(this);
    dest->addEdge(this);

}
Node *Edge::origNode() const
{
    return orig;
}

Node *Edge::destNode() const
{
    return dest;
}
