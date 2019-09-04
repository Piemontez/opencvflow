#include "imgproc.h"
#include "globals.h"

#include <QString>

/**
 * @brief SobelNode::SobelNode
 */
SobelNode::SobelNode(): NodeItem(nullptr, "Sobel") {}

void SobelNode::proccess() {
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::Sobel(mat, out, ddepth, dx, dy, ksize, scale, delta);
            _sources.push_back(out);
        }
    }
}

SobelComponent::SobelComponent() : ProcessorComponent(ProcessorsTB, "Sobel") { }
Node *SobelComponent::createNode() { return new SobelNode; }

/**
 * @brief CannyNode::CannyNode
 */
CannyNode::CannyNode():  NodeItem(nullptr, "Canny") {}

void CannyNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::Canny(mat, out, 80, 170);
            _sources.push_back(out);
        }
    }

}

CannyComponent::CannyComponent() : ProcessorComponent(ProcessorsTB, "Canny") { }
Node *CannyComponent::createNode() { return new CannyNode; }

/**
 * @brief CannyNode::CannyNode
 */
LaplacianNode::LaplacianNode():  NodeItem(nullptr, "Laplacian") {}

void LaplacianNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::Laplacian(mat, out, CV_8U);
            _sources.push_back(out);
        }
    }

}

LaplacianComponent::LaplacianComponent() : ProcessorComponent(ProcessorsTB, "Laplacian") { }
Node *LaplacianComponent::createNode() { return new LaplacianNode; }
