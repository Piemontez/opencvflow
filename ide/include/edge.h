#ifndef EDGE_H
#define EDGE_H

class Node;
class NodeItem;

/**
 * @brief The Edge;
 */
class Edge
{
public:
    explicit Edge(Node *sourceNode, Node *destNode);

    Node *sourceNode() const;
    Node *destNode() const;

protected:
    Node *source, *dest;
};

#endif // EDGE_H
