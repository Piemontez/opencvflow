#ifndef PLUGIN_H
#define PLUGIN_H

#include "globals.h"
#include <vector>

namespace ocvflow {

class Component;

/**
 * @brief The ActivatorInterface class
 */
class PluginInterface
{
public:
    PluginInterface() {};
    virtual ~PluginInterface() {};

    virtual std::vector<Component*> components() = 0;
};

}

#endif // PLUGIN_H
