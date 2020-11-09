#include "nodemenuitem.h"
#include "window.h"

#include <QLabel>
#include <QMouseEvent>

using namespace ocvflow;

NodeMenuItem::NodeMenuItem(QString title, QWidget *parent)
    : QToolBar(parent)
{
    this->addWidget(new QLabel(title));

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
