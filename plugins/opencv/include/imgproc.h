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
public:
    CannyNode();
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


#endif // OPCVF_IMGPROC_H
