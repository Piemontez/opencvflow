#include "node.h"
#include "edge.h"


Node::Node()
{

}
void Node::addEdge(Edge *edge)
{
    _edges.push_back( edge );
}

std::vector<Edge *>& Node::edges()
{
    return _edges;
}

std::vector<cv::Mat>& Node::sources()
{
    return _sources;
}
