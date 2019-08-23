#ifndef COMPONENT_H
#define COMPONENT_H

#include <string>
#include <vector>
#include <functional>

class Node;
class Edge;
class QAction;
class QWidget;

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
class ProcessorComponent: public Component
{
    uint actionBar;
    std::string _name;
    std::function<void (const std::vector<Edge *> &)> _func;
public:
    ProcessorComponent(uint actionBar, std::function<void (const std::vector<Edge *> &)> func);
    ProcessorComponent(uint actionBar, std::string name, std::function<void (const std::vector<Edge *> &)> func);

    std::string name() override;
    Node* createNode() override;

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
