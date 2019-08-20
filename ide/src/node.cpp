#include "node.h"
#include "edge.h"


Node::Node()
{

}
void Node::addEdge(Edge *edge)
{
    _edges << edge;
}

QList<Edge *> Node::edges() const
{
    return _edges;
}
std::vector<cv::Mat> Node::sources() const
{
    return _sources;
}
