#ifndef NODE_H
#define NODE_H


#include "opencv2/opencv.hpp"

class Edge;
class EdgeItem;
class CentralWidget;

namespace cv {
    class VideoCapture;
    class Mat;
}

/**
 * @brief The Node;
 */
class Node
{
public:
    explicit Node();

    void addEdge(Edge *edge);
    std::vector<Edge *> edges() const;
    std::vector<cv::Mat> sources() const;

    virtual void proccess() = 0;

protected:
    std::vector<Edge *> _edges;
    std::vector<cv::Mat> _sources;
};

#endif // NODE_H
