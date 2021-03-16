#include <chrono>
#include "opencv2/highgui.hpp"
#include "opencv2/imgcodecs.hpp"
#include "opencv2/imgproc.hpp"

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
    auto histAction = new QAction(tr("View histogram"));
    auto close = new QAction;
    close->setIcon(this->style()->standardIcon(QStyle::SP_TitleBarCloseButton));

    auto spacer = new QWidget;
    spacer->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);

    menu->addAction(histAction);
    menuBar->addMenu(menu);
    menuBar->addAction(close);

    this->addWidget(titleLabel);
    this->addWidget(spacer);
    this->addWidget(menuBar);

    connect(close, &QAction::triggered, this, [parent]() {
        auto nodeItem = static_cast<NodeItem *>(parent);
        if (nodeItem)
        {
            MainWindow::instance()->removeNode(nodeItem);
        }
    });
    connect(histAction, &QAction::triggered, this, [parent]() {
        auto nodeItem = static_cast<NodeItem *>(parent);
        if (nodeItem)
        {
            MainWindow::instance()->addNode(new HistogramNode(nodeItem));
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