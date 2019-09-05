#include "videoio.h"
#include "globals.h"

VideoCaptureNode::VideoCaptureNode():  NodeItem(nullptr, "VideoCapture") {
    cap = new cv::VideoCapture(index);
}

void VideoCaptureNode::proccess()
{
    _sources.clear();

    if(!cap->isOpened())
        return;

    cv::Mat frame;
    *cap >> frame;

    _sources.push_back(frame);
}

VideoCaptureComponent::VideoCaptureComponent() : ProcessorComponent(SourcesTB, "VideoCapture") { }
Node *VideoCaptureComponent::createNode() { return new VideoCaptureNode; }
