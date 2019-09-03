#ifndef PLUGIN_H
#define PLUGIN_H

#include "globals.h"
#include <vector>

class Component;


namespace ocvflow {

//https://sourcey.com/articles/building-a-simple-cpp-cross-platform-plugin-system
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
