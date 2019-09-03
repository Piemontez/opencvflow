#ifndef PLUGIN_H
#define PLUGIN_H

#include "component.h"

class Plugin : public PluginInterface
{
    std::vector<Component*> components() const override;
};

#endif // PLUGIN_H
