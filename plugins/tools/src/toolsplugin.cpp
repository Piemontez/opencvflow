#include "toolsplugin.hpp"

#include <QGraphicsProxyWidget>
#include <QObject>
#include <QAction>
#include "window.h"
#include "items.h"
#include "nodetools.hpp"

OCVFLOW_PLUGIN(ToolsPlugin, "Tools Plugin", "0.1.1")

std::vector<QObject *> ToolsPlugin::nodeToolBarActions(ocvflow::NodeItem *nodeItem)
{
    auto actions = std::vector<QObject *>();
    if (!nodeItem)
        return actions;

    auto histAction = new QAction(QObject::tr("View histogram"));
    nodeItem->connect(histAction, &QAction::triggered, histAction, [nodeItem]() {
        if (nodeItem)
        {
            auto histoNode = new HistogramNode;
            auto pos = nodeItem->graphicsProxyWidget()->pos();
            auto size = histoNode->size();
            
            ocvflow::MainWindow::instance()
                ->addNode(histoNode)
                ->setPos(pos - QPoint(5, size.height() + 5));

            ocvflow::MainWindow::instance()
                ->connectNode(nodeItem, histoNode);
        }
    });

    actions.push_back(histAction);

    return actions;
}