#include "component.h"
#include "window.h"
#include "edge.h"

std::vector<Component *> PluginInterface::components()
{
    std::vector<Component *> rs;

    rs.push_back(new ProcessorComponent(MainWindow::SourcesTB, "Video Stream", [] (const std::vector<Edge *> &) {

    }));


    return rs;
}
