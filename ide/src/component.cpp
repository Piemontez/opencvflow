#include "component.h"
#include "node.h"
#include "edge.h"

std::string Component::name()
{
    return "";
}

Node *Component::createNode()
{
    return nullptr;
}

QAction *Component::createAction()
{
    return nullptr;
}

QWidget *Component::createWidget()
{
    return nullptr;
}

uint Component::actionToolBar()
{
    return -1;
}

/**
 * @brief ProcessorComponent
 */
class ProcessorNode: public Node {
    std::function<void (const std::vector<Edge *> &)> func;
public:
    ProcessorNode(std::function<void (const std::vector<Edge *> &)> func) {
        this->func = func;
    }
    void proccess() override {
        sources().clear();

        this->func(this->edges());
    };

};

ProcessorComponent::ProcessorComponent(uint actionBar, std::function< void (const std::vector<Edge *> &) > func)
{
    this->actionBar = actionBar;
    _name = "Third Party";
    _func = func;
}

ProcessorComponent::ProcessorComponent(uint actionBar, std::string name, std::function< void (const std::vector<Edge *> &) > func)
{
    this->actionBar = actionBar;
    _name = name;
    _func = func;
}

std::string ProcessorComponent::name()
{
    return _name;
}

Node *ProcessorComponent::createNode()
{
    return new ProcessorNode(this->_func);
}

uint ProcessorComponent::actionToolBar()
{
    return actionBar;
}
