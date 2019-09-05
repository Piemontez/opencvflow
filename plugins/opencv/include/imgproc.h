#ifndef OPCVF_IMGPROC_H
#define OPCVF_IMGPROC_H

#include "items.h"
#include "component.h"

/**
 * @brief The SobelNode class
 */
class SobelNode: public NodeItem {
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

class SobelComponent: public ProcessorComponent
{
public:
    SobelComponent();
    Node* createNode() override;
};

/**
 * @brief The CannyNode class
 */
class CannyNode: public NodeItem {
public:
    CannyNode();
    void proccess() override;
};


class CannyComponent: public ProcessorComponent
{
public:
    CannyComponent();
    Node* createNode() override;
};

/**
 * @brief The LaplacianNode class
 */
class LaplacianNode: public NodeItem {
public:
    LaplacianNode();
    void proccess() override;
};


class LaplacianComponent: public ProcessorComponent
{
public:
    LaplacianComponent();
    Node* createNode() override;
};


#endif // OPCVF_IMGPROC_H
