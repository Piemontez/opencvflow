#ifndef TOOLSPLUGIN_H
#define TOOLSPLUGIN_H

#include "plugin.h"

class ToolsPlugin : public ocvflow::PluginInterface
{
    virtual std::vector<QObject*> nodeToolBarActions(ocvflow::NodeItem* nodeItem) override;
};

#endif // TOOLSPLUGIN_H
