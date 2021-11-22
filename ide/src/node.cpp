#include "node.h"
#include "edge.h"

#include <QSemaphore>

using namespace ocvflow;

Node::Node()
{
    semaphore = new QSemaphore(1);
}
Node::~Node()
{
    acquire();
    _edges.clear();
    _sources.clear();
    release();

    delete semaphore;
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

void Node::start()
{

}

void Node::stop()
{

}

void Node::acquire()
{
    semaphore->acquire();
}

void Node::release()
{
    semaphore->release();
}
