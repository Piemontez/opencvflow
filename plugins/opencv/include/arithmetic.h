#ifndef OPCVF_ARITHMETIC_H
#define OPCVF_ARITHMETIC_H

#include "items.h"
#include "component.h"

/**
 * @brief The ArithmeticPlusNode class
 */
class ArithmeticPlusNode: public ocvflow::NodeItem {
public:
    ArithmeticPlusNode();

    void proccess() override;
};


class ArithmeticPlusComponent: public ocvflow::ProcessorComponent
{
public:
    ArithmeticPlusComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The ArithmeticSubNode class
 */
class ArithmeticSubNode: public ocvflow::NodeItem {
public:
    ArithmeticSubNode();

    void proccess() override;
};


class ArithmeticSubComponent: public ocvflow::ProcessorComponent
{
public:
    ArithmeticSubComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The ArithmeticMultiplyNode class
 */
class ArithmeticMultiplyNode: public ocvflow::NodeItem {
public:
    ArithmeticMultiplyNode();

    void proccess() override;
};


class ArithmeticMultiplyComponent: public ocvflow::ProcessorComponent
{
public:
    ArithmeticMultiplyComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The ArithmeticDivNode class
 */
class ArithmeticDivNode: public ocvflow::NodeItem {
public:
    ArithmeticDivNode();

    void proccess() override;
};


class ArithmeticDivComponent: public ocvflow::ProcessorComponent
{
public:
    ArithmeticDivComponent();
    ocvflow::Node* createNode() override;
};
#endif // OPCVF_ARITHMETIC_H



/**
 * @brief The ArithmeticMulNode class
 */
class ArithmeticMulNode: public ocvflow::NodeItem {
public:
    ArithmeticMulNode();

    void proccess() override;
};


class ArithmeticMulComponent: public ocvflow::ProcessorComponent
{
public:
    ArithmeticMulComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The KernelNode class
 */
class ArithmeticKernelNode: public ocvflow::NodeItem {
    cv::Mat kernel;
    cv::Point anchor{cv::Point(-1,-1)};
public:
    ArithmeticKernelNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class ArithmeticKernelComponent: public ocvflow::ProcessorComponent
{
public:
    ArithmeticKernelComponent();
    ocvflow::Node* createNode() override;
};