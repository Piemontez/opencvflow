#include "component.h"
#include "node.h"
#include "edge.h"
#include "items.h"
#include "action.h"

#include <QDebug>

using namespace ocvflow;

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
class NodeItemPrivate {
    CentralWidget *centralWidget;
    QRect contentSize;

    friend class NodeItem;
};
class ProcessorNode: public NodeItem {
    ProcessFunc func;
public:
    ProcessorNode(QString title, ProcessFunc func): NodeItem(nullptr, title) {
        this->func = func;
    }
    void proccess() override {
        sources().clear();

        auto mats = this->func(this->edges());

        sources().insert(sources().begin(), mats.begin(), mats.end());
    };
};

ProcessorComponent::ProcessorComponent(uint actionBar, ProcessFunc func)
{
    this->actionBar = actionBar;
    _name = "Third Party";
    _func = func;
}

ProcessorComponent::ProcessorComponent(uint actionBar, std::string name, ProcessFunc func)
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
    return new ProcessorNode(QString::fromStdString(_name), this->_func);
}

QWidget *ProcessorComponent::createWidget()
{
    return new FlowAction(this->name(),
                QString::fromStdString(this->name()));
}

uint ProcessorComponent::actionToolBar()
{
    return actionBar;
}
