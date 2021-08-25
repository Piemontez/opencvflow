#include "arithmetic.h"
#include "globals.h"

using namespace ocvflow;

/**
 * + Plus
 */
ArithmeticPlusNode::ArithmeticPlusNode() : NodeItem(nullptr, "ArithmeticPlusNode")
{
}

void ArithmeticPlusNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                if (!out.rows)
                    out = mat.clone();
                else
                    out += mat;
            }
    }
    _sources.push_back(out);
}

ArithmeticPlusComponent::ArithmeticPlusComponent() : ProcessorComponent(ArithmeticTB, "+") {}
Node *ArithmeticPlusComponent::createNode() { return new ArithmeticPlusNode; }


/**
 * + Sub
 */
ArithmeticSubNode::ArithmeticSubNode() : NodeItem(nullptr, "ArithmeticSubNode")
{
}

void ArithmeticSubNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                if (!out.rows)
                    out = mat.clone();
                else
                    out -= mat;
            }
    }
    _sources.push_back(out);
}

ArithmeticSubComponent::ArithmeticSubComponent() : ProcessorComponent(ArithmeticTB, "-") {}
Node *ArithmeticSubComponent::createNode() { return new ArithmeticSubNode; }


/**
 * + Multiply
 */
ArithmeticMultiplyNode::ArithmeticMultiplyNode() : NodeItem(nullptr, "ArithmeticMultiplyNode")
{
}

void ArithmeticMultiplyNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                if (!out.rows)
                    out = mat.clone();
                else
                    out *= mat;
            }
    }
    _sources.push_back(out);
}

ArithmeticMultiplyComponent::ArithmeticMultiplyComponent() : ProcessorComponent(ArithmeticTB, "*") {}
Node *ArithmeticMultiplyComponent::createNode() { return new ArithmeticMultiplyNode; }


/**
 * + Div
 */
ArithmeticDivNode::ArithmeticDivNode() : NodeItem(nullptr, "ArithmeticDivNode")
{
}

void ArithmeticDivNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                if (!out.rows)
                    out = mat.clone();
                else
                    out /= mat;
            }
    }
    _sources.push_back(out);
}

ArithmeticDivComponent::ArithmeticDivComponent() : ProcessorComponent(ArithmeticTB, "/") {}
Node *ArithmeticDivComponent::createNode() { return new ArithmeticDivNode; }


/**
 * + Mul
 */
ArithmeticMulNode::ArithmeticMulNode() : NodeItem(nullptr, "ArithmeticMulNode")
{
}

void ArithmeticMulNode::proccess()
{
    _sources.clear();

    cv::Mat out;

    for (auto &&edge : _edges)
    {
        if (edge->destNode() == this)
            for (auto &&mat : edge->origNode()->sources())
            {
                if (!out.rows)
                    out = mat.clone();
                else
                    out = out.mul(mat);
            }
    }
    _sources.push_back(out);
}

ArithmeticMulComponent::ArithmeticMulComponent() : ProcessorComponent(ArithmeticTB, "Mul") {}
Node *ArithmeticMulComponent::createNode() { return new ArithmeticMulNode; }

/**
 * + Kernel
 */
ArithmeticKernelNode::ArithmeticKernelNode() : NodeItem(nullptr, "Kernel")
{
    kernel = cv::Mat(cv::Size(3, 3), CV_64F, cv::Scalar(0));
}

void ArithmeticKernelNode::proccess()
{
    _sources.clear();

    _sources.push_back(kernel);
}

ArithmeticKernelComponent::ArithmeticKernelComponent() : ProcessorComponent(ArithmeticTB, "Kernel") {}
Node *ArithmeticKernelComponent::createNode() { return new ArithmeticKernelNode; }