#ifndef NODE_H
#define NODE_H


#include "opencv2/opencv.hpp"

class QSemaphore;
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
    std::vector<Edge *>& edges();
    std::vector<cv::Mat>& sources();

    virtual void start();
    virtual void proccess() = 0;
    virtual void stop();

    //Semaphore
    void acquire();
    void release();

protected:
    QSemaphore *semaphore;
    std::vector<Edge *> _edges;
    std::vector<cv::Mat> _sources;
};

#endif // NODE_H
