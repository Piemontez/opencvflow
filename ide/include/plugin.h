#ifndef PLUGIN_H
#define PLUGIN_H

#include "globals.h"
#include <vector>

class QObject;

namespace ocvflow {

class Component;
class NodeItem;

/**
 * @brief The ActivatorInterface class
 */
class PluginInterface
{
public:
    PluginInterface() {};
    virtual ~PluginInterface() {};

    //Components add on toolbar to create a node
    virtual std::vector<Component*> components() {
        return std::vector<Component*>();
    }
    //Node actions to add on the toolbar of node widgets
    virtual std::vector<QObject*> nodeToolBarActions(NodeItem* nodeItem) {
        return std::vector<QObject*>();
    }
};

}

#endif // PLUGIN_H
