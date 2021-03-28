#include "imgcodecs.h"
#include "globals.h"

using namespace ocvflow;

ImReadNode::ImReadNode() : NodeItem(nullptr, "ImRead")
{
}

void ImReadNode::proccess()
{
    _sources.clear();

    cv::Mat frame = cv::imread(file);

    _sources.push_back(frame);
}

ImReadComponent::ImReadComponent() : ProcessorComponent(SourcesTB, "ImRead") {}
Node *ImReadComponent::createNode() { return new ImReadNode; }
