#ifndef OPCVF_IMGPROC_H
#define OPCVF_IMGPROC_H

#include "items.h"
#include "component.h"

/**
 * @brief The SobelNode class
 */
class SobelNode: public ocvflow::NodeItem {
    int ddepth{CV_8U};
    int dx{1};
    int dy{0};
    int ksize{3};
    double scale{1};
    double delta{0};
public:
    SobelNode();
    QWidget* createPropertiesWidget(QWidget* parent) override;
    void proccess() override;
};

class SobelComponent: public ocvflow::ProcessorComponent
{
public:
    SobelComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The CannyNode class
 */
class CannyNode: public ocvflow::NodeItem {
    double threshold1{80};
    double threshold2{170};
    int aperturesize{3};
    bool L2gradiente{0};
public:
    CannyNode();
    QWidget* createPropertiesWidget(QWidget* parent) override;
    void proccess() override;
};


class CannyComponent: public ocvflow::ProcessorComponent
{
public:
    CannyComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The LaplacianNode class
 */
class LaplacianNode: public ocvflow::NodeItem {
public:
    LaplacianNode();
    void proccess() override;
};


class LaplacianComponent: public ocvflow::ProcessorComponent
{
public:
    LaplacianComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The MedianBlurNode class
 */
class MedianBlurNode: public ocvflow::NodeItem {
public:
    MedianBlurNode();
    void proccess() override;
};


class MedianBlurComponent: public ocvflow::ProcessorComponent
{
public:
    MedianBlurComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The GaussianBlurNode class
 */
class GaussianBlurNode: public ocvflow::NodeItem {
public:
    GaussianBlurNode();
    void proccess() override;
};


class GaussianBlurComponent: public ocvflow::ProcessorComponent
{
public:
    GaussianBlurComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The BilateralFilterNode class
 */
class BilateralFilterNode: public ocvflow::NodeItem {
public:
    BilateralFilterNode();
    void proccess() override;
};


class BilateralFilterComponent: public ocvflow::ProcessorComponent
{
public:
    BilateralFilterComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The BoxFilterNode class
 */
class BoxFilterNode: public ocvflow::NodeItem {
public:
    BoxFilterNode();
    void proccess() override;
};


class BoxFilterComponent: public ocvflow::ProcessorComponent
{
public:
    BoxFilterComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The SqrBoxFilterNode class
 */
class SqrBoxFilterNode: public ocvflow::NodeItem {
public:
    SqrBoxFilterNode();
    void proccess() override;
};


class SqrBoxFilterComponent: public ocvflow::ProcessorComponent
{
public:
    SqrBoxFilterComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The BlurNode class
 */
class BlurNode: public ocvflow::NodeItem {
public:
    BlurNode();
    void proccess() override;
};


class BlurComponent: public ocvflow::ProcessorComponent
{
public:
    BlurComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The ScharrNode class
 */
class ScharrNode: public ocvflow::NodeItem {
public:
    ScharrNode();
    void proccess() override;
};


class ScharrComponent: public ocvflow::ProcessorComponent
{
public:
    ScharrComponent();
    ocvflow::Node* createNode() override;
};


#endif // OPCVF_IMGPROC_H
