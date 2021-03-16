#ifndef COMPONENT_H
#define COMPONENT_H

#include <string>
#include <vector>
#include <functional>

class QAction;
class QWidget;
namespace cv {
    class Mat;
}

namespace ocvflow {

class Node;
class Edge;

/**
 * @brief The Component class
 */
class Component
{
public:
    //Node nase
    virtual std::string name();
    //Function called to create a node.
    virtual Node* createNode();

    //Use only one: action or widget to add button on toolbarmenu
    virtual QAction* createAction();
    virtual QWidget* createWidget();

    //Menu Identifier
    virtual uint actionToolBar();
};

/**
 * @brief The ProcessorComponent class
 */

typedef std::function< std::vector<cv::Mat> (const std::vector<Edge *> &) > ProcessFunc;

class ProcessorComponent: public Component
{
    uint actionBar;
    std::string _name;
    ProcessFunc _func;
public:
    ProcessorComponent(uint actionBar, ProcessFunc func);
    ProcessorComponent(uint actionBar, std::string name, ProcessFunc func = nullptr);

    std::string name() override;
    virtual Node* createNode() override;
    QWidget* createWidget() override;

    uint actionToolBar() override;
};

}

#endif // COMPONENT_H
