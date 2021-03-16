#ifndef PLUGIN_H
#define PLUGIN_H

#include "globals.h"
#include <vector>

class QAction;
class QMenu;
class QMenuBar;

namespace ocvflow {

class Component;
class QObject;

/**
 * @brief The ActivatorInterface class
 */
class PluginInterface
{
public:
    PluginInterface() {};
    virtual ~PluginInterface() {};

    //Components add on toolbar to create a node
    virtual std::vector<Component*> components() = 0;
    //Node actions add on the toolbar of node widgets
    virtual std::vector<QObject*> nodeToolBarActions() = 0;
};

}

#endif // PLUGIN_H
