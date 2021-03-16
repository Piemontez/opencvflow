#include <chrono>

#include "nodemenuitem.h"
#include "items.h"
#include "window.h"

#include <QLabel>
#include <QMenuBar>
#include <QStyle>
#include <QMenu>
#include <QAction>
#include <QMouseEvent>

using namespace ocvflow;

NodeMenuItem::NodeMenuItem(QString title, QWidget *parent)
    : QToolBar(parent)
{
    auto titleLabel = new QLabel(title);

    auto menuBar = new QMenuBar;
    menuBar->setSizePolicy(QSizePolicy::Minimum, QSizePolicy::Expanding);
    auto menu = new QMenu(tr("..."));
    auto close = new QAction;
    close->setIcon(this->style()->standardIcon(QStyle::SP_TitleBarCloseButton));

    auto spacer = new QWidget;
    spacer->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);

    menuBar->addMenu(menu);
    menuBar->addAction(close);

    this->addWidget(titleLabel);
    this->addWidget(spacer);
    this->addWidget(menuBar);

    MainWindow::instance()->addNodeToolbarActions(menu, static_cast<NodeItem*>(parent));

    connect(close, &QAction::triggered, this, [parent]() {
        auto nodeItem = static_cast<NodeItem *>(parent);
        if (nodeItem)
        {
            MainWindow::instance()->removeNode(nodeItem);
        }
    });

    //installEventFilter(this);
    //setMouseTracking(true);
}

void NodeMenuItem::mousePressEvent(QMouseEvent *event)
{
    QWidget::mousePressEvent(event);

    MainWindow::instance()->nodeMenuMousePressEvent(this, event);

    event->accept();
}

void NodeMenuItem::mouseMoveEvent(QMouseEvent *event)
{
    MainWindow::instance()->nodeMenuMouseMoveEvent(this, event);

    QWidget::mouseMoveEvent(event);
}

void NodeMenuItem::mouseReleaseEvent(QMouseEvent *event)
{
    MainWindow::instance()->nodeMenuMouseReleaseEvent(this, event);

    QWidget::mouseReleaseEvent(event);
}