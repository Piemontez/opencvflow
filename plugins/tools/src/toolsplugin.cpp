#include "toolsplugin.hpp"

#include <QObject>
#include <QAction>
#include "window.h"
#include "items.h"
#include "nodetools.hpp"

OCVFLOW_PLUGIN(ToolsPlugin, "Tools Plugin", "0.1.1")

std::vector<QObject *> ToolsPlugin::nodeToolBarActions(ocvflow::NodeItem* nodeItem)
{
    auto actions = std::vector<QObject*>();
    if (!nodeItem) return actions;

    auto histAction = new QAction(QObject::tr("View histogram"));
    nodeItem->connect(histAction, &QAction::triggered, histAction, [nodeItem]() {
        if (nodeItem)
        {
            ocvflow::MainWindow::instance()->addNode(new HistogramNode(nodeItem));
        }
    });

    actions.push_back(histAction);

    return actions;
}