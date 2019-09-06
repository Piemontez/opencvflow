#ifndef OPCVF_VIDEOIO_H
#define OPCVF_VIDEOIO_H

#include "items.h"
#include "component.h"

namespace cv {
    class VideoCapture;
}

/**
 * @brief The VideoCaptureNode class
 */
class VideoCaptureNode: public NodeItem {
    cv::VideoCapture* cap;
    int index{0};
public:
    VideoCaptureNode();
    void start() override;
    void proccess() override;
    void stop() override;
};


class VideoCaptureComponent: public ProcessorComponent
{
public:
    VideoCaptureComponent();
    Node* createNode() override;
};


#endif // OPCVF_VIDEOIO_H
