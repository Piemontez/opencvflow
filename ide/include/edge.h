#ifndef EDGE_H
#define EDGE_H

namespace ocvflow {

class Node;
class NodeItem;

/**
 * @brief The Edge;
 */
class Edge
{
public:
    explicit Edge(Node *sourceNode, Node *destNode);

    Node *origNode() const;
    Node *destNode() const;

protected:
    Node *orig, *dest;
};

}

#endif // EDGE_H
