#ifndef COMPONENT_H
#define COMPONENT_H

#include <string>
#include <list>

class Node;
class QAction;

/**
 * @brief The Component class
 */
class Component
{
public:
    virtual std::string name() = 0;
    virtual Node* createNode();
    virtual QAction* createAction();
    virtual uint actionToolBar();
};

/**
 * @brief The ActivatorInterface class
 */
class PluginInterface
{
public:
    virtual std::list<Component> components() const = 0;
};
#endif // COMPONENT_H
