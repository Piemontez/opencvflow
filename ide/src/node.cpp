#include "node.h"
#include "edge.h"

class NodePrivate {
    QList<Edge *> edges;

    std::vector<cv::Mat> sources;

    friend class Node;
};

Node::Node():
    d_ptr(new NodePrivate)
{

}
void Node::addEdge(Edge *edge)
{
    d_func()->edges << edge;
}

QList<Edge *> Node::edges() const
{
    return d_func()->edges;
}
std::vector<cv::Mat> Node::sources() const
{
    return d_func()->sources;
}