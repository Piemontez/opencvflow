#include "videoio.h"
#include "globals.h"

using namespace ocvflow;

VideoCaptureNode::VideoCaptureNode():  NodeItem(nullptr, "VideoCapture") {
    cap = new cv::VideoCapture();
}

void VideoCaptureNode::start()
{
    cap->open(index);
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

void VideoCaptureNode::stop()
{
    if(cap->isOpened())
        cap->release();
}

VideoCaptureComponent::VideoCaptureComponent() : ProcessorComponent(SourcesTB, "VideoCapture") { }
Node *VideoCaptureComponent::createNode() { return new VideoCaptureNode; }
