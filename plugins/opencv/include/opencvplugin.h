#ifndef OPENCVPLUGIN_H
#define OPENCVPLUGIN_H

#include "plugin.h"

class OpenCVPlugin : public ocvflow::PluginInterface
{
    std::vector<Component*> components() override;
};

#endif // OPENCVPLUGIN_H
