#include "node.h"
#include "edge.h"
#include "items.h"
#include "nodemenuitem.h"
#include "nodelinkitem.h"
#include "window.h"
#include "utils.h"

#include <QPainter>
#include <QStyleOptionGraphicsItem>
#include <QGraphicsSceneContextMenuEvent>
#include <QWidget>

using namespace ocvflow;

class ocvflow::NodeItemPrivate {
    CentralWidget *centralWidget;
    QRect contentSize;
    QString title;

    friend class NodeItem;
};

NodeItem::NodeItem(CentralWidget *centralWidget, QString title)
    : d_ptr(new NodeItemPrivate)
{
    d_func()->centralWidget = centralWidget;
    d_func()->contentSize = QRect(0, 0, 480, 200);

    setFlag(ItemIsMovable);
    setFlag(ItemSendsGeometryChanges);
    setCacheMode(DeviceCoordinateCache);
    setZValue(-1);

    addToGroup(new NodeMenuItem(this));

    addToGroup(new NodeLinkItem(this));

    setHandlesChildEvents(false);
    setAcceptHoverEvents(true);

    d_func()->title = title.isEmpty()
            ? "Empty Node"
            : title;
}

QString NodeItem::title()
{
    return d_func()->title;
}

QWidget *NodeItem::createPropertiesWidget(QWidget *parent)
{
    return nullptr;
}

QRect NodeItem::contentRegion()
{
    return d_func()->contentSize;
}

void NodeItem::addEdge(EdgeItem *edge)
{
    NodeItem::addEdge(edge);
    
    edge->adjust();
}

QRectF NodeItem::boundingRect() const
{
    return QRectF(-20, -25, d_func()->contentSize.width() + 40, d_func()->contentSize.height() + 25);
}

QPainterPath NodeItem::shape() const
{
    QPainterPath path;
    path.addRect(d_func()->contentSize);
    return path;
}

void NodeItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *wid)
{
    painter->setBrush(QBrush(Qt::darkGray, Qt::SolidPattern));
    painter->setPen(Qt::NoBrush);
    painter->drawRect(d_func()->contentSize);

    contentPaint(d_func()->contentSize, painter, option, wid);

    painter->setBrush(Qt::NoBrush);
    painter->setPen(QPen(Qt::lightGray, 0));
    painter->drawRect(d_func()->contentSize);
}

void NodeItem::contentPaint(const QRect &region, QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    acquire();
    if (data(ocvflow::ErrorData).isValid()) {
        painter->setPen(QPen(Qt::white, 4));
        painter->drawLine(region.left(), region.top(), region.right(), region.bottom());
        painter->drawLine(region.right(), region.top(), region.left(), region.bottom());
    } else {
        cv::Mat out;
        for (auto && mat: sources())
        {
            cv::resize(mat, out, cv::Size(region.width(), region.height()));
            painter->drawImage(region.left(), region.top(), cvMatToQImage(out));
        }
    }

    release();
}

QVariant NodeItem::itemChange(GraphicsItemChange change, const QVariant &value)
{
    switch (change) {
    case ItemPositionHasChanged:
        foreach (Edge *edge, edges())
            static_cast<EdgeItem *>(edge)->adjust();
        break;
    default:
        break;
    };

    return QGraphicsItem::itemChange(change, value);
}

void NodeItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    QGraphicsItem::mousePressEvent(event);
    if(event->button() == Qt::LeftButton) {
        if(event->modifiers() == Qt::ShiftModifier || event->modifiers() == Qt::AltModifier) {

        } else {
            MainWindow::instance()->nodeClicked(this);
        }
    }
}

void NodeItem::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
    MainWindow::instance()->update();

    QGraphicsItem::mouseReleaseEvent(event);
}

/*
void NodeItem::hoverEnterEvent(QGraphicsSceneHoverEvent *event)
{

}

void NodeItem::hoverLeaveEvent(QGraphicsSceneHoverEvent *event)
{

}*/

/*
void NodeItem::contextMenuEvent(QGraphicsSceneContextMenuEvent *event)
{
    QMenu *menu = new QMenu;
    QAction *action = new QAction("Connect");
    action->setData(QVariant::fromValue((void*)this));

    QObject::connect(action, &QAction::triggered, d_func()->centralWidget, &CentralWidget::connectNode);

    menu->addAction(action);
    menu->popup(event->screenPos());
}
*/
