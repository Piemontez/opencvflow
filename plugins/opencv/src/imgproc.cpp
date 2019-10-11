#include "imgproc.h"
#include "globals.h"

#include <QString>

using namespace ocvflow;

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
            cv::Canny(mat, out, threshold1, threshold1, aperturesize, L2gradiente);
            _sources.push_back(out);
        }
    }

}

CannyComponent::CannyComponent() : ProcessorComponent(ProcessorsTB, "Canny") { }
Node *CannyComponent::createNode() { return new CannyNode; }

/**
 * @brief LaplacianNode::LaplacianNode
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
            cv::Laplacian(mat, out, ddepth, ksize, scale, delta);
            _sources.push_back(out);
        }
    }
}

LaplacianComponent::LaplacianComponent() : ProcessorComponent(ProcessorsTB, "Laplacian") { }
Node *LaplacianComponent::createNode() { return new LaplacianNode; }

/**
 * @brief MedianBlurNode::MedianBlurNode
 */
MedianBlurNode::MedianBlurNode():  NodeItem(nullptr, "MedianBlur") {}

void MedianBlurNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::medianBlur(mat, out, ksize);
            _sources.push_back(out);
        }
    }

}

MedianBlurComponent::MedianBlurComponent() : ProcessorComponent(ProcessorsTB, "MedianBlur") { }
Node *MedianBlurComponent::createNode() { return new MedianBlurNode; }

/**
 * @brief GaussianBlurNode::GaussianBlurNode
 */
GaussianBlurNode::GaussianBlurNode():  NodeItem(nullptr, "GaussianBlur") {}

void GaussianBlurNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::GaussianBlur(mat, out, cv::Size(3, 3), 1);
            _sources.push_back(out);
        }
    }

}

GaussianBlurComponent::GaussianBlurComponent() : ProcessorComponent(ProcessorsTB, "GaussianBlur") { }
Node *GaussianBlurComponent::createNode() { return new GaussianBlurNode; }

/**
 * @brief BilateralFilterNode::BilateralFilterNode
 */
BilateralFilterNode::BilateralFilterNode():  NodeItem(nullptr, "BilateralFilter") {}

void BilateralFilterNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::bilateralFilter(mat, out, 1, 1, 1);
            _sources.push_back(out);
        }
    }

}

BilateralFilterComponent::BilateralFilterComponent() : ProcessorComponent(ProcessorsTB, "BilateralFilter") { }
Node *BilateralFilterComponent::createNode() { return new BilateralFilterNode; }

/**
 * @brief BoxFilterNode::BoxFilterNode
 */
BoxFilterNode::BoxFilterNode():  NodeItem(nullptr, "BoxFilter") {}

void BoxFilterNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::boxFilter(mat, out, 1, cv::Size(3, 3));
            _sources.push_back(out);
        }
    }

}

BoxFilterComponent::BoxFilterComponent() : ProcessorComponent(ProcessorsTB, "BoxFilter") { }
Node *BoxFilterComponent::createNode() { return new BoxFilterNode; }


/**
 * @brief SqrBoxFilterNode::SqrBoxFilterNode
 */
SqrBoxFilterNode::SqrBoxFilterNode():  NodeItem(nullptr, "SqrBoxFilter") {}

void SqrBoxFilterNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::sqrBoxFilter(mat, out, 1, cv::Size(3, 3));
            _sources.push_back(out);
        }
    }

}

SqrBoxFilterComponent::SqrBoxFilterComponent() : ProcessorComponent(ProcessorsTB, "SqrBoxFilter") { }
Node *SqrBoxFilterComponent::createNode() { return new SqrBoxFilterNode; }


/**
 * @brief BlurNode::BlurNode
 */
BlurNode::BlurNode():  NodeItem(nullptr, "Blur") {}

void BlurNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::blur(mat, out, cv::Size(3, 3));
            _sources.push_back(out);
        }
    }

}

BlurComponent::BlurComponent() : ProcessorComponent(ProcessorsTB, "Blur") { }
Node *BlurComponent::createNode() { return new BlurNode; }

/**
 * @brief ScharrNode::ScharrNode
 */
ScharrNode::ScharrNode():  NodeItem(nullptr, "Scharr") {}

void ScharrNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto && edge: _edges)
    {
        for (auto && mat: edge->sourceNode()->sources())
        {
            cv::Scharr(mat, out, 1, 1, 0);
            _sources.push_back(out);
        }
    }

}

ScharrComponent::ScharrComponent() : ProcessorComponent(ProcessorsTB, "Scharr") { }
Node *ScharrComponent::createNode() { return new ScharrNode; }
