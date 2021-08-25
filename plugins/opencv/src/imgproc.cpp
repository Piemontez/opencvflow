#include <opencv2/imgproc/imgproc.hpp>

#include "imgproc.h"
#include "globals.h"

#include <QString>

using namespace ocvflow;

/**
 * @brief SobelNode::SobelNode
 */
SobelNode::SobelNode() : NodeItem(nullptr, "Sobel") {}

void SobelNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::Sobel(mat, out, ddepth, dx, dy, ksize, scale, delta);
                _sources.push_back(out);
            }
    }
}

SobelComponent::SobelComponent() : ProcessorComponent(ProcessorsTB, "Sobel") {}
Node *SobelComponent::createNode() { return new SobelNode; }

/**
 * @brief CannyNode::CannyNode
 */
CannyNode::CannyNode() : NodeItem(nullptr, "Canny") {}

void CannyNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::Canny(mat, out, threshold1, threshold1, aperturesize, L2gradiente);
                _sources.push_back(out);
            }
    }
}

CannyComponent::CannyComponent() : ProcessorComponent(ProcessorsTB, "Canny") {}
Node *CannyComponent::createNode() { return new CannyNode; }

/**
 * @brief LaplacianNode::LaplacianNode
 */
LaplacianNode::LaplacianNode() : NodeItem(nullptr, "Laplacian") {}

void LaplacianNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::Laplacian(mat, out, ddepth, ksize, scale, delta);
                _sources.push_back(out);
            }
    }
}

LaplacianComponent::LaplacianComponent() : ProcessorComponent(ProcessorsTB, "Laplacian") {}
Node *LaplacianComponent::createNode() { return new LaplacianNode; }

/**
 * @brief MedianBlurNode::MedianBlurNode
 */
MedianBlurNode::MedianBlurNode() : NodeItem(nullptr, "MedianBlur") {}

void MedianBlurNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::medianBlur(mat, out, ksize);
                _sources.push_back(out);
            }
    }
}

MedianBlurComponent::MedianBlurComponent() : ProcessorComponent(ProcessorsTB, "MedianBlur") {}
Node *MedianBlurComponent::createNode() { return new MedianBlurNode; }

/**
 * @brief GaussianBlurNode::GaussianBlurNode
 */
GaussianBlurNode::GaussianBlurNode() : NodeItem(nullptr, "GaussianBlur") {}

void GaussianBlurNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::GaussianBlur(mat, out, size, sigmaX, sigmaY);
                _sources.push_back(out);
            }
    }
}

GaussianBlurComponent::GaussianBlurComponent() : ProcessorComponent(ProcessorsTB, "GaussianBlur") {}
Node *GaussianBlurComponent::createNode() { return new GaussianBlurNode; }

/**
 * @brief BilateralFilterNode::BilateralFilterNode
 */
BilateralFilterNode::BilateralFilterNode() : NodeItem(nullptr, "BilateralFilter") {}

void BilateralFilterNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::bilateralFilter(mat, out, d, sigmaColor, sigmaSpace);
                _sources.push_back(out);
            }
    }
}

BilateralFilterComponent::BilateralFilterComponent() : ProcessorComponent(ProcessorsTB, "BilateralFilter") {}
Node *BilateralFilterComponent::createNode() { return new BilateralFilterNode; }

/**
 * @brief BoxFilterNode::BoxFilterNode
 */
BoxFilterNode::BoxFilterNode() : NodeItem(nullptr, "BoxFilter") {}

void BoxFilterNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::boxFilter(mat, out, ddepth, ksize, anchor, normalize);
                _sources.push_back(out);
            }
    }
}

BoxFilterComponent::BoxFilterComponent() : ProcessorComponent(ProcessorsTB, "BoxFilter") {}
Node *BoxFilterComponent::createNode() { return new BoxFilterNode; }

/**
 * @brief SqrBoxFilterNode::SqrBoxFilterNode
 */
SqrBoxFilterNode::SqrBoxFilterNode() : NodeItem(nullptr, "SqrBoxFilter") {}

void SqrBoxFilterNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::sqrBoxFilter(mat, out, ddepth, ksize, anchor, normalize);
                _sources.push_back(out);
            }
    }
}

SqrBoxFilterComponent::SqrBoxFilterComponent() : ProcessorComponent(ProcessorsTB, "SqrBoxFilter") {}
Node *SqrBoxFilterComponent::createNode() { return new SqrBoxFilterNode; }

/**
 * @brief BlurNode::BlurNode
 */
BlurNode::BlurNode() : NodeItem(nullptr, "Blur") {}

void BlurNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::blur(mat, out, ksize, anchor);
                _sources.push_back(out);
            }
    }
}

BlurComponent::BlurComponent() : ProcessorComponent(ProcessorsTB, "Blur") {}
Node *BlurComponent::createNode() { return new BlurNode; }

/**
 * @brief ScharrNode::ScharrNode
 */
ScharrNode::ScharrNode() : NodeItem(nullptr, "Scharr") {}

void ScharrNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::Scharr(mat, out, ddepth, dx, dy, scale, delta);
                _sources.push_back(out);
            }
    }
}

ScharrComponent::ScharrComponent() : ProcessorComponent(ProcessorsTB, "Scharr") {}
Node *ScharrComponent::createNode() { return new ScharrNode; }

/**
 * @brief DilateNode::DilateNode
 */
DilateNode::DilateNode() : NodeItem(nullptr, "Dilate")
{
    kernel = cv::getStructuringElement(cv::MORPH_ELLIPSE, cv::Point(3, 3));
}

void DilateNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::dilate(mat, out, kernel, anchor, iterations, borderType, borderValue);
                _sources.push_back(out);
            }
    }
}

DilateComponent::DilateComponent() : ProcessorComponent(ProcessorsTB, "Dilate") {}
Node *DilateComponent::createNode() { return new DilateNode; }

/**
 * @brief ErodeNode::ErodeNode
 */
ErodeNode::ErodeNode() : NodeItem(nullptr, "Erode")
{
    kernel = cv::getStructuringElement(cv::MORPH_ELLIPSE, cv::Point(3, 3));
}

void ErodeNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::erode(mat, out, kernel, anchor, iterations, borderType, borderValue);
                _sources.push_back(out);
            }
    }
}

ErodeComponent::ErodeComponent() : ProcessorComponent(ProcessorsTB, "Erode") {}
Node *ErodeComponent::createNode() { return new ErodeNode; }

/**
 * @brief CvtColorNode::CvtColorNode
 */
CvtColorNode::CvtColorNode() : NodeItem(nullptr, "CvtColor") {}

void CvtColorNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                cv::cvtColor(mat, out, code, dstCn);
                _sources.push_back(out);
            }
    }
}

CvtColorComponent::CvtColorComponent() : ProcessorComponent(ProcessorsTB, "CvtColor") {}
Node *CvtColorComponent::createNode() { return new CvtColorNode; }

/**
 * @brief Filter2DNode::Filter2DNode
 */
Filter2DNode::Filter2DNode() : NodeItem(nullptr, "Filter2D") {}

void Filter2DNode::proccess()
{
    _sources.clear();

    cv::Mat kernel, out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                if (!kernel.rows)
                    kernel = mat.clone();
                else {
                    cv::filter2D(mat, out, -1, kernel);
                    _sources.push_back(out);
                }
            }
    }
}

Filter2DComponent::Filter2DComponent() : ProcessorComponent(ProcessorsTB, "Filter2D") {}
Node *Filter2DComponent::createNode() { return new Filter2DNode; }
