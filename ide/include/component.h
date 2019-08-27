#ifndef COMPONENT_H
#define COMPONENT_H

#include <string>
#include <vector>
#include <functional>

class Node;
class Edge;
class QAction;
class QWidget;
namespace cv {
    class Mat;
}
/**
 * @brief The Component class
 */
class Component
{
public:
    virtual std::string name();
    virtual Node* createNode();

    //Use only one: action or widget
    virtual QAction* createAction();
    virtual QWidget* createWidget();

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
    ProcessorComponent(uint actionBar, std::string name, ProcessFunc func);

    std::string name() override;
    Node* createNode() override;
    QWidget* createWidget() override;

    uint actionToolBar() override;
};

/**
 * @brief The ActivatorInterface class
 */
class PluginInterface
{
public:
    //virtual std::list<Component> components() const = 0;
    virtual std::vector<Component*> components();
};
#endif // COMPONENT_H
